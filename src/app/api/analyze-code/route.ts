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
        inputData: string;
        console: { log: (...args: unknown[]) => void };
    } = {
        inputData: input,
        console: {
            log: (...args: unknown[]) => {
                output += args.join(" ") + "\n";
            },
        },
    };

    vm.createContext(sandbox);

    const wrappedCode = `
        const input = inputData.trim().split("\\n");
        ${code}
    `;

    vm.runInContext(wrappedCode, sandbox, { timeout: 1000 });

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
            } catch {
                actual = "Runtime Error";
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
            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "あなたは優秀なプログラミング講師です。提出コードがなぜ失敗したかを簡潔に説明してください。",
                    },
                    {
                        role: "user",
                        content: `
コード:
${body.code}

テスト結果:
${JSON.stringify(caseResults, null, 2)}

関数チェック:
${JSON.stringify(functionChecks, null, 2)}
`,
                    },
                ],
                temperature: 0.5,
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
