"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    Code2,
    ArrowRight,
    ArrowLeft,
    RefreshCcw,
    PenLine,
    Loader2,
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
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    explanation: string;
    sampleInput: string;
    sampleOutput: string;
    constraints?: string;
    timeLimit: number;
    memoryLimit: number;
    testCases: Array<{
        id: string;
        input: string;
        output: string;
    }>;
    tags: string[];
};

const defaultCode = `import fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
// console.log を使って出力してみよう！
`;

/* =====================
 * Page
 * ===================== */

export default function ProblemPage() {
    const params = useParams();
    const router = useRouter();
    const problemId = params.id as string;

    const [problem, setProblem] = useState<Problem | null>(null);
    const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState("");

    useEffect(() => {
        fetchProblem();
        fetchTutorial();
    }, [problemId]);

    const fetchProblem = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/problems/${problemId}`);
            if (!res.ok) {
                throw new Error("Problem not found");
            }
            const data = await res.json();
            setProblem(data);
        } catch (error) {
            console.error("Failed to fetch problem:", error);
            router.push("/problems");
        } finally {
            setLoading(false);
        }
    };

    const fetchTutorial = async () => {
        try {
            const res = await fetch(`/api/problems/${problemId}/tutorial`);
            const data = await res.json();
            setTutorialSteps(data.steps);
            setTutorialOpen(true);
        } catch (error) {
            console.error("Failed to fetch tutorial:", error);
        }
    };

    const current = tutorialSteps[step];
    const isLastStep = step === tutorialSteps.length - 1;

    const handleSubmit = async () => {
        // TODO: 回答提出のロジックを実装
        alert("回答提出機能は実装中です");
    };

    if (loading || !problem) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                {/* ===== Header ===== */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Code2 className="h-7 w-7 text-violet-500" />
                        {problem.title}
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                        <Badge>{problem.category}</Badge>
                        <Badge variant="secondary">
                            難易度: {problem.difficulty}
                        </Badge>
                        {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* ===== Main Layout ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Problem */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>問題文</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-4">
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {problem.description}
                            </div>

                            {problem.constraints && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">制約</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {problem.constraints}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">入力例</h3>
                                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                                    {problem.sampleInput}
                                </pre>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">出力例</h3>
                                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                                    {problem.sampleOutput}
                                </pre>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">制限</h3>
                                <p className="text-sm text-muted-foreground">
                                    実行時間制限: {problem.timeLimit}ms
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    メモリ制限: {problem.memoryLimit}MB
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editor */}
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle>コードエディタ</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full font-mono text-sm p-4 border rounded-md bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* ===== Actions ===== */}
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/problems")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            一覧に戻る
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setStep(0);
                                setTutorialOpen(true);
                            }}
                        >
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            チュートリアルを再確認
                        </Button>
                    </div>

                    <Button onClick={handleSubmit}>
                        <PenLine className="h-4 w-4 mr-1" />
                        回答する
                    </Button>
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
            {current && (
                <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{current.title}</span>
                                <span className="text-sm text-muted-foreground font-normal">
                                    {step + 1} / {tutorialSteps.length}
                                </span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
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
                                <Button onClick={() => setTutorialOpen(false)}>
                                    始める
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
