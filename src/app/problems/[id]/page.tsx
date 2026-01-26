"use client";

import { useEffect, useState } from "react";
import {
    Code2,
    ArrowRight,
    ArrowLeft,
    X,
    BookOpen,
    RefreshCcw,
    PenLine,
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

/* =====================
 * Types
 * ===================== */

type TutorialStep = {
    title: string;
    description: string;
    code?: string;
};

type Problem = {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
};

/* =====================
 * Mock Data
 * ===================== */

const tutorialSteps: TutorialStep[] = [
    {
        title: "fs.readFileSync とは？",
        description: "Node.js で標準入力を同期的に読み込むための関数です。",
    },
    {
        title: "基本的な使い方",
        description:
            "fs.readFileSync(0, 'utf8') で標準入力を文字列として取得できます。",
        code: `import fs from "fs";

const input = fs.readFileSync(0, "utf8");
console.log(input);`,
    },
];

const problem: Problem = {
    title: "標準入力を受け取って出力せよ",
    description: `整数 N が 1 行で与えられます。
N をそのまま出力してください。

【制約】
・1 ≤ N ≤ 10^9

【入力例】
5

【出力例】
5`,
    difficulty: "Easy",
    category: "入出力",
};

/* =====================
 * Page
 * ===================== */

export default function ProblemPage() {
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [code, setCode] = useState<string>(
        "// ここにコードを書いてください\n",
    );

    const current = tutorialSteps[step];
    const isLastStep = step === tutorialSteps.length - 1;

    useEffect(() => {
        setTutorialOpen(true);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                {/* ===== Header ===== */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Code2 className="h-7 w-7 text-violet-500" />
                        {problem.title}
                    </h1>
                    <div className="flex gap-2">
                        <Badge>{problem.category}</Badge>
                        <Badge variant="secondary">
                            難易度: {problem.difficulty}
                        </Badge>
                    </div>
                </div>

                {/* ===== Main Layout ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ===== Problem Statement ===== */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>問題文</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap">
                            {problem.description}
                        </CardContent>
                    </Card>

                    {/* ===== Editor ===== */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                コードエディタ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full font-mono text-sm p-4 border rounded-md bg-muted resize-none"
                            />
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
                        チュートリアルを再確認
                    </Button>

                    <Button>
                        <PenLine className="h-4 w-4 mr-1" />
                        回答する
                    </Button>
                </div>
            </div>

            {/* ===== Tutorial Dialog ===== */}
            <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{current.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            {current.description}
                        </p>

                        {current.code && (
                            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                                <code>{current.code}</code>
                            </pre>
                        )}
                    </div>

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
