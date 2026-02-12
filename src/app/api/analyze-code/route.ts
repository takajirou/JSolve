import { NextRequest, NextResponse } from "next/server";
import vm from "node:vm";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type TestCase = {
    input: string;
    output: string;
};

type JudgeRequest = {
    code: string;
    requiredFunctions: string[];
    cases: TestCase[];
};

type CaseResult = {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
};

type FunctionCheckResult = {
    functionName: string;
    isUsed: boolean;
    explanation: string;
};

const normalize = (text: string): string => text.trim().replace(/\r\n/g, "\n");

const executeCode = (code: string, input: string): string => {
    let output = "";

    const sandbox: {
        console: { log: (...args: unknown[]) => void };
        fs: {
            readFileSync: (fd: number, encoding: string) => string;
        };
        require: (module: string) => unknown;
    } = {
        console: {
            log: (...args: unknown[]) => {
                output += args.join(" ") + "\n";
            },
        },
        fs: {
            readFileSync: (fd: number, encoding: string) => {
                if (fd === 0 && encoding === "utf8") {
                    return input;
                }
                throw new Error("Only stdin (fd=0) is supported");
            },
        },
        require: (module: string) => {
            if (module === "fs" || module === "node:fs") {
                return sandbox.fs;
            }
            throw new Error(`Module '${module}' is not available`);
        },
    };

    vm.createContext(sandbox);

    // import文をrequireに変換
    const transformedCode = code
        .replace(
            /import\s+\*\s+as\s+(\w+)\s+from\s+["']fs["'];?/g,
            'const $1 = require("fs");',
        )
        .replace(
            /import\s+\*\s+as\s+(\w+)\s+from\s+["']node:fs["'];?/g,
            'const $1 = require("fs");',
        );

    try {
        vm.runInContext(transformedCode, sandbox, { timeout: 1000 });
    } catch (error) {
        throw error;
    }

    return output.trim();
};

const checkFunctions = (
    code: string,
    requiredFunctions: string[],
): FunctionCheckResult[] => {
    return requiredFunctions.map((fn) => {
        const regex = new RegExp(`\\b${fn}\\b`);
        const isUsed = regex.test(code);

        return {
            functionName: fn,
            isUsed,
            explanation: isUsed
                ? `${fn} が使用されています`
                : `${fn} が使用されていません`,
        };
    });
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as JudgeRequest;

        const caseResults: CaseResult[] = body.cases.map((testCase) => {
            let actual = "";
            let passed = false;

            try {
                actual = executeCode(body.code, testCase.input);
                passed = normalize(actual) === normalize(testCase.output);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Runtime Error";
                actual = `Error: ${errorMessage}`;
                passed = false;
            }

            return {
                input: testCase.input,
                expected: testCase.output,
                actual,
                passed,
            };
        });

        const allPassed = caseResults.every((c) => c.passed);

        const functionChecks = checkFunctions(
            body.code,
            body.requiredFunctions,
        );

        const allFunctionsUsed = functionChecks.every((f) => f.isUsed);

        const success = allPassed && allFunctionsUsed;

        let feedback: string | undefined;

        if (!success) {
            const failedCases = caseResults
                .map((c, i) => {
                    if (!c.passed) {
                        return `【テストケース ${i + 1}】
入力:
${c.input}

期待される出力:
${c.expected}

実際の出力:
${c.actual}`;
                    }
                    return null;
                })
                .filter(Boolean)
                .join("\n\n");

            const missingFunctions = functionChecks
                .filter((f) => !f.isUsed)
                .map((f) => f.functionName);

            const hasRuntimeError = caseResults.some((c) =>
                c.actual.startsWith("Error:"),
            );
            const hasOutputMismatch = caseResults.some(
                (c) => !c.passed && !c.actual.startsWith("Error:"),
            );

            let problemType = "";
            if (hasRuntimeError) {
                problemType = "実行時エラーが発生しています。";
            } else if (hasOutputMismatch) {
                problemType = "出力が期待値と一致していません。";
            } else if (missingFunctions.length > 0) {
                problemType = `必須関数（${missingFunctions.join(", ")}）が使用されていません。`;
            }

            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `あなたは優秀なプログラミング講師です。
学生が提出したJavaScriptコードの問題点を分析し、具体的で建設的なフィードバックを日本語で提供してください。

重要な前提知識:
- const fs = require("fs"); と fs.readFileSync(0, "utf8") は標準入力を読み込む正しい方法です
- テスト環境では標準入力は正しく提供されています
- 実際にエラーが発生している場合のみ、エラーについて言及してください
- 出力が期待値と異なる場合は、ロジックや計算、データ処理の問題を指摘してください

フィードバックの方針:
- 2-3文で簡潔に問題点と改善方法を説明してください
- 実際に起きている問題（エラーまたは出力不一致）に焦点を当ててください
- 具体的な改善のヒントを提供してください（答えは教えない）`,
                    },
                    {
                        role: "user",
                        content: `以下のコードの問題点を分析してください。

【問題の種類】
${problemType}

【提出コード】
\`\`\`javascript
${body.code}
\`\`\`

${failedCases}

${missingFunctions.length > 0 ? `\n【使用すべき関数】\n${missingFunctions.join(", ")}` : ""}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            });

            feedback = aiResponse.choices[0]?.message?.content ?? undefined;
        }

        return NextResponse.json({
            success,
            caseResults,
            functionChecks,
            feedback,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
