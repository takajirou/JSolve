"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TutorialStep } from "../../types/problem";

type Props = {
    open: boolean;
    steps: TutorialStep[];
    step: number;
    onOpenChange: (open: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
};

export function TutorialDialog({
    open,
    steps,
    step,
    onOpenChange,
    onNext,
    onPrev,
    onFinish,
}: Props) {
    const current = steps[step];
    const isFirst = step === 0;
    const isLast = step === steps.length - 1;

    if (!current) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{current.title}</span>
                        <span className="text-sm text-muted-foreground font-normal">
                            {step + 1} / {steps.length}
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
                        disabled={isFirst}
                        onClick={onPrev}
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        戻る
                    </Button>

                    {!isLast ? (
                        <Button onClick={onNext}>
                            次へ
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button onClick={onFinish}>
                            始める
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
