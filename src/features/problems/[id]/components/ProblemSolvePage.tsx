"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProblemCard } from "@/features/problems/[id]/components/ProblemCard";
import { ActionBar } from "@/features/problems/[id]/components/ActionBar";
import { TutorialDialog } from "@/features/problems/[id]/components/TutorialDialog";
import { ExecutionResult } from "@/features/problems/[id]/components/ExecutionResult";
import { SubmitResultDialog } from "../../components/SubmitResultDialog";
import { CodeEditorCard } from "./CodeEditorCard";
import { useCodeRunner } from "@/features/problems/[id]/hooks/useCodeRunner";
import { useStaticProblem } from "@/features/problems/[id]/hooks/useStatickProbolems";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    problemId: string;
};

type TestCase = {
    input: string;
    output: string;
};

type CaseResult = {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
};

type FunctionCheck = {
    functionName: string;
    isUsed: boolean;
    explanation: string;
};

type JudgeResponse = {
    success: boolean;
    caseResults: CaseResult[];
    functionChecks: FunctionCheck[];
    feedback?: string;
};

const INITIAL_CODE = `import * as fs from "fs"; 
const input = fs.readFileSync(0, "utf8");

 // ここから実装 
 // console.log("Hello World"); ;
`;

const getStorageKey = (problemId: string): string => `jsolve:code:${problemId}`;

const getTutorialSeenKey = (problemId: string): string =>
    `jsolve:tutorial-seen:${problemId}`;

export function ProblemSolvePage({ problemId }: Props) {
    const router = useRouter();
    const { problem, tutorial, testcases, loading } =
        useStaticProblem(problemId);
    const { isRunning, result, runSample, reset } = useCodeRunner();
    const [code, setCode] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitOpen, setSubmitOpen] = useState<boolean>(false);
    const [submitData, setSubmitData] = useState<JudgeResponse | null>(null);
    const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
    const [tutorialStep, setTutorialStep] = useState<number>(0);

    useEffect(() => {
        const saved = localStorage.getItem(getStorageKey(problemId));

        setCode(saved ?? INITIAL_CODE);
    }, [problemId]);

    useEffect(() => {
        if (!code) return;

        localStorage.setItem(getStorageKey(problemId), code);
    }, [code, problemId]);

    useEffect(() => {
        if (!tutorial || loading) return;

        const seen = localStorage.getItem(getTutorialSeenKey(problemId));

        if (!seen) {
            setTutorialStep(0);
            setTutorialOpen(true);
        }
    }, [tutorial, loading, problemId]);

    const handleCloseTutorial = () => {
        setTutorialOpen(false);
        localStorage.setItem(getTutorialSeenKey(problemId), "true");
    };

    const handleOpenTutorial = () => {
        setTutorialStep(0);
        setTutorialOpen(true);
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        reset();
    };

    const handleRunSample = () => {
        if (!testcases) return;

        const sample = testcases.cases[0];
        runSample(code, sample.input, sample.output);
    };

    const handleSubmit = async () => {
        if (!problem || !testcases) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/analyze-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    requiredFunctions: problem.requiredFunctions ?? [],
                    cases: testcases.cases as TestCase[],
                }),
            });

            const data = (await response.json()) as JudgeResponse;

            setSubmitData(data);
            setSubmitOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.push("/problems");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Skeleton className="h-40 w-96" />
            </div>
        );
    }

    if (!problem || !testcases) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                問題が見つかりませんでした
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ActionBar
                isRunning={isRunning || isSubmitting}
                onBack={handleBack}
                onRunSample={handleRunSample}
                onSubmit={handleSubmit}
                onOpenTutorial={handleOpenTutorial}
            />

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

            {/* Tutorial Dialog */}
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

            {/* Submit Result */}
            {submitData && (
                <SubmitResultDialog
                    open={submitOpen}
                    success={submitData.success}
                    functionChecks={submitData.functionChecks}
                    feedback={submitData.feedback ?? ""}
                    caseResults={submitData.caseResults}
                    onClose={() => setSubmitOpen(false)}
                    onRetry={() => setSubmitOpen(false)}
                />
            )}
        </div>
    );
}
