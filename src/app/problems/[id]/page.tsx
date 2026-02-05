"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Problem, TutorialStep } from "@/features/problems/types/problem";

import { ProblemHeader } from "@/features/problems/[id]/components/ProblemHeader";
import { ProblemCard } from "@/features/problems/[id]/components/ProblemCard";
import { CodeEditorCard } from "@/features/problems/[id]/components/CodeEditorCard";
import { ActionBar } from "@/features/problems/[id]/components/ActionBar";
import { RunOutputCard } from "@/features/problems/[id]/components/RunOutputCard";
import { TutorialDialog } from "@/features/problems/[id]/components/TutorialDialog";

/* =====================
 * Constants
 * ===================== */

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
    const [loading, setLoading] = useState<boolean>(true);

    const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);

    const [code, setCode] = useState<string>(defaultCode);
    const [runOutput, setRunOutput] = useState<string>("未実行");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    /* =====================
     * Data Fetch
     * ===================== */

    const fetchProblem = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/problems/${problemId}`);

            if (!res.ok) {
                throw new Error("Problem not found");
            }

            const data: Problem = await res.json();
            setProblem(data);
        } catch (error) {
            console.error("Failed to fetch problem:", error);
            router.push("/problems");
        } finally {
            setLoading(false);
        }
    }, [problemId, router]);

    const fetchTutorial = useCallback(async () => {
        try {
            const res = await fetch(`/api/problems/${problemId}/tutorial`);
            if (!res.ok) {
                return;
            }

            const data: { steps: TutorialStep[] } = await res.json();
            setTutorialSteps(data.steps);

            if (data.steps.length > 0) {
                setTutorialOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch tutorial:", error);
        }
    }, [problemId]);

    useEffect(() => {
        fetchProblem();
        fetchTutorial();
    }, [fetchProblem, fetchTutorial]);

    /* =====================
     * Handlers
     * ===================== */

    const handleRunTest = async () => {
        if (!problem) {
            return;
        }

        setIsRunning(true);

        try {
            const res = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    input: problem.sampleInput,
                }),
            });

            const data: {
                stdout?: string;
                stderr?: string;
                result?: string;
            } = await res.json();

            if (data.result === "TIME_LIMIT_EXCEEDED") {
                setRunOutput("実行時間制限超過");
            } else if (data.stderr) {
                setRunOutput(`エラー:\n${data.stderr}`);
            } else {
                setRunOutput(data.stdout || "（出力なし）");
            }
        } catch {
            setRunOutput("サーバー実行に失敗しました");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        // TODO: 提出ロジック
        alert("回答提出機能は実装中です");
    };

    /* =====================
     * Loading
     * ===================== */

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

    /* =====================
     * Render
     * ===================== */

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                {/* ===== Header ===== */}
                <ProblemHeader problem={problem} />

                {/* ===== Main Layout ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProblemCard problem={problem} />
                    <CodeEditorCard code={code} onChange={setCode} />
                </div>

                {/* ===== Actions ===== */}
                <ActionBar
                    isRunning={isRunning}
                    onBack={() => router.push("/problems")}
                    onRun={handleRunTest}
                    onSubmit={handleSubmit}
                    onOpenTutorial={() => {
                        setStep(0);
                        setTutorialOpen(true);
                    }}
                />

                {/* ===== Output ===== */}
                <RunOutputCard output={runOutput} />
            </div>

            {/* ===== Tutorial ===== */}
            <TutorialDialog
                open={tutorialOpen}
                steps={tutorialSteps}
                step={step}
                onOpenChange={setTutorialOpen}
                onPrev={() => setStep((s) => s - 1)}
                onNext={() => setStep((s) => s + 1)}
                onFinish={() => setTutorialOpen(false)}
            />
        </div>
    );
}
