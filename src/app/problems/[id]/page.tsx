"use client";

import { useState } from "react";
import {
    Code2,
    ArrowRight,
    ArrowLeft,
    X,
    RefreshCcw,
    PenLine,
    Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CodeEditor } from "@/features/editor/components/editor";
import { transformCodeForBrowser } from "@/features/editor/lib/transformCodeForBrowser";

/* =====================
 * Types
 * ===================== */

type TutorialStep = {
    title: string;
    description: string;
    code?: string;
};

/* =====================
 * Data
 * ===================== */

const tutorialSteps: TutorialStep[] = [
    {
        title: "fs.readFileSync とは？",
        description:
            "Node.js で標準入力を同期的に読み込むための関数です。競技プログラミングで最もよく使われます。",
    },
    {
        title: "基本的な使い方",
        description:
            "fs.readFileSync(0, 'utf8') と書くことで標準入力を一括取得できます。",
        code: `import fs from "fs";

const input = fs.readFileSync(0, "utf8");
console.log(input);`,
    },
];

const problem = {
    title: "標準入力を受け取って出力せよ",
    category: "入出力",
    difficulty: "Easy",
    description: `整数 N が 1 行で与えられます。
N をそのまま出力してください。

【制約】
1 ≤ N ≤ 10^9

【入力例】
5

【出力例】
5`,
};

const defaultCode = `import fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
// console.log を使って出力してみよう！
`;

/* =====================
 * Page
 * ===================== */

export default function ProblemPage() {
    const [tutorialOpen, setTutorialOpen] = useState(true);
    const [step, setStep] = useState(0);
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState("");

    const current = tutorialSteps[step];
    const isLastStep = step === tutorialSteps.length - 1;

    const runCode = () => {
        const logs: string[] = [];
        const originalLog = console.log;

        console.log = (...args: unknown[]) => {
            logs.push(args.map(String).join(" "));
        };

        try {
            const transformedCode = transformCodeForBrowser(code, "5");

            new Function(transformedCode)();
        } catch (e) {
            if (e instanceof Error) {
                logs.push(`エラー: ${e.message}`);
            }
        }

        console.log = originalLog;
        setOutput(logs.join("\n"));
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                {/* ===== Header ===== */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Code2 className="h-7 w-7 text-violet-500" />
                        {problem.title}
                    </h1>
                    <div className="flex gap-2 mt-2">
                        <Badge>{problem.category}</Badge>
                        <Badge variant="secondary">
                            難易度: {problem.difficulty}
                        </Badge>
                    </div>
                </div>

                {/* ===== Main Layout ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Problem */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>問題文</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm">
                            {problem.description}
                        </CardContent>
                    </Card>

                    {/* Editor */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>コードエディタ</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CodeEditor value={code} onChange={setCode} />
                        </CardContent>
                    </Card>
                </div>

                {/* ===== Actions ===== */}
                <div className="flex justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => setTutorialOpen(true)}
                    >
                        <RefreshCcw className="h-4 w-4 mr-1" />
                        チュートリアル
                    </Button>

                    <div className="flex gap-2">
                        <Button onClick={runCode}>
                            <Play className="h-4 w-4 mr-1" />
                            実行
                        </Button>
                        <Button>
                            <PenLine className="h-4 w-4 mr-1" />
                            回答する
                        </Button>
                    </div>
                </div>

                {/* ===== Output ===== */}
                <Card>
                    <CardHeader>
                        <CardTitle>実行結果</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md text-sm">
                            {output || "未実行"}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            {/* ===== Tutorial Dialog ===== */}
            <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{current.title}</DialogTitle>
                    </DialogHeader>

                    <p className="text-muted-foreground">
                        {current.description}
                    </p>

                    {current.code && (
                        <pre className="bg-muted p-4 rounded-md text-sm mt-4">
                            <code>{current.code}</code>
                        </pre>
                    )}

                    <div className="flex justify-between pt-6">
                        <Button
                            variant="secondary"
                            disabled={step === 0}
                            onClick={() => setStep((s) => s - 1)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            戻る
                        </Button>

                        {!isLastStep ? (
                            <Button onClick={() => setStep((s) => s + 1)}>
                                次へ
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                onClick={() => setTutorialOpen(false)}
                            >
                                <X className="h-4 w-4 mr-1" />
                                閉じる
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
