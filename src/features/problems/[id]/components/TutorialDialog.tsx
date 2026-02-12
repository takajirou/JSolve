"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TutorialDialogItem } from "@/features/problems/types/problem";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

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
        <Dialog open={open} onOpenChange={(open) => !open && onFinish()}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>チュートリアル</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {step + 1} / {dialog.length}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                    {current.type === "text" && (
                        <div className="prose prose-sm max-w-none">
                            <p className="text-base leading-relaxed">
                                {current.value}
                            </p>
                        </div>
                    )}

                    {current.type === "code" && (
                        <div className="space-y-2">
                            {current.language && (
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {current.language}
                                </div>
                            )}
                            <pre className="bg-muted border rounded-lg p-4 overflow-x-auto">
                                <code className="text-sm font-mono">
                                    {current.value}
                                </code>
                            </pre>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex items-center justify-between border-t pt-4">
                    <Button
                        onClick={onPrev}
                        disabled={step === 0}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        戻る
                    </Button>

                    <div className="flex gap-1">
                        {dialog.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-8 rounded-full transition-colors ${
                                    i === step
                                        ? "bg-primary"
                                        : i < step
                                          ? "bg-primary/40"
                                          : "bg-muted"
                                }`}
                            />
                        ))}
                    </div>

                    {step < dialog.length - 1 ? (
                        <Button onClick={onNext} size="sm" className="gap-2">
                            次へ
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={onFinish} size="sm" className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            始める
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
