"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TutorialDialogItem } from "@/features/problems/types/problem";

type Props = {
    open: boolean;
    dialog: TutorialDialogItem[];
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
};

export function TutorialDialog({
    open,
    dialog,
    step,
    onNext,
    onPrev,
    onFinish,
}: Props) {
    const current = dialog[step];
    if (!current) return null;

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-2xl space-y-6">
                {current.type === "text" && (
                    <p className="leading-relaxed">{current.value}</p>
                )}

                {current.type === "code" && (
                    <pre className="bg-muted p-4 rounded-md text-sm">
                        <code>{current.value}</code>
                    </pre>
                )}

                <div className="flex justify-between">
                    <Button
                        onClick={onPrev}
                        disabled={step === 0}
                        variant="secondary"
                    >
                        戻る
                    </Button>

                    {step < dialog.length - 1 ? (
                        <Button onClick={onNext}>次へ</Button>
                    ) : (
                        <Button onClick={onFinish}>始める</Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
