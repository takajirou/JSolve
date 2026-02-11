"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProblemCard } from "@/features/problems/[id]/components/ProblemCard";
import { ActionBar } from "@/features/problems/[id]/components/ActionBar";
import { TutorialDialog } from "@/features/problems/[id]/components/TutorialDialog";
import { ExecutionResult } from "@/features/problems/[id]/components/ExecutionResult";
import { CodeEditorCard } from "./CodeEditorCard";
import { useCodeRunner } from "@/features/problems/[id]/hooks/useCodeRunner";
import { useStaticProblem } from "@/features/problems/[id]/hooks/useStatickProbolems";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    problemId: string;
};

export function ProblemSolvePage({ problemId }: Props) {
    const router = useRouter();
    const { problem, tutorial, testcases, loading } =
        useStaticProblem(problemId);
    const { isRunning, result, runSample, reset } = useCodeRunner();

    const [code, setCode] = useState("");
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);

    const handleOpenTutorial = () => {
        setTutorialStep(0);
        setTutorialOpen(true);
    };

    const handleCloseTutorial = () => {
        setTutorialOpen(false);
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        reset(); // コード変更時に結果をリセット
    };

    // サンプル実行
    const handleRunSample = () => {
        if (!testcases || testcases.cases.length === 0) return;

        const sample = testcases.cases[0];
        runSample(code, sample.input, sample.output);
    };

    // 提出
    const handleSubmit = () => {
        // 提出処理を実装
        console.log("Submit code:", code);
    };

    // 一覧に戻る
    const handleBack = () => {
        router.push("/problems");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="border-b bg-card px-6 py-4">
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Skeleton className="h-[600px]" />
                        <Skeleton className="h-[600px]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!problem || !testcases) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">
                    問題が見つかりませんでした
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* アクションバー */}
            <ActionBar
                isRunning={isRunning}
                onBack={handleBack}
                onRunSample={handleRunSample}
                onSubmit={handleSubmit}
                onOpenTutorial={handleOpenTutorial}
            />

            {/* メインコンテンツ */}
            <div className="flex-1 container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProblemCard problem={problem} testcases={testcases} />

                    <div className="space-y-4">
                        <CodeEditorCard
                            code={code}
                            onChange={handleCodeChange}
                        />

                        {result && <ExecutionResult result={result} />}
                    </div>
                </div>
            </div>

            {/* チュートリアルダイアログ */}
            {tutorial && (
                <TutorialDialog
                    open={tutorialOpen}
                    dialog={tutorial.dialog}
                    step={tutorialStep}
                    onNext={() => setTutorialStep((s) => s + 1)}
                    onPrev={() => setTutorialStep((s) => s - 1)}
                    onFinish={handleCloseTutorial}
                />
            )}
        </div>
    );
}
