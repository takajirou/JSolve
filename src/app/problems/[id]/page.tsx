"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/ui/loading";

import { useStaticProblem } from "@/features/problems/[id]/hooks/useStatickProbolems";
import { ProblemHeader } from "@/features/problems/[id]/components/ProblemHeader";
import { ProblemCard } from "@/features/problems/[id]/components/ProblemCard";
import { CodeEditorCard } from "@/features/problems/[id]/components/CodeEditorCard";
import { ActionBar } from "@/features/problems/[id]/components/ActionBar";
import { RunOutputCard } from "@/features/problems/[id]/components/RunOutputCard";
import { TutorialDialog } from "@/features/problems/[id]/components/TutorialDialog";

const defaultCode = `// TypeScript で書いてみよう
`;

export default function ProblemPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { problem, tutorial, testcases, loading } = useStaticProblem(id);

    const [code, setCode] = useState(defaultCode);
    const [runOutput, setRunOutput] = useState("未実行");
    const [tutorialOpen, setTutorialOpen] = useState(
        Boolean(tutorial?.dialog.length),
    );
    const [step, setStep] = useState(0);

    if (loading || !problem || !testcases) {
        return <Loading />;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            <ProblemHeader problem={problem} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProblemCard problem={problem} testcases={testcases} />
                <CodeEditorCard code={code} onChange={setCode} />
            </div>

            <ActionBar
                isRunning={false}
                onBack={() => router.push("/problems")}
                onRun={() => setRunOutput("※ 実行機能は後続")}
                onSubmit={() => alert("提出は未実装")}
                onOpenTutorial={() => {
                    setStep(0);
                    setTutorialOpen(true);
                }}
            />

            <RunOutputCard output={runOutput} />

            {tutorial && (
                <TutorialDialog
                    open={tutorialOpen}
                    dialog={tutorial.dialog}
                    step={step}
                    onNext={() => setStep((s) => s + 1)}
                    onPrev={() => setStep((s) => s - 1)}
                    onFinish={() => setTutorialOpen(false)}
                />
            )}
        </div>
    );
}
