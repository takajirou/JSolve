"use client";

import { ArrowLeft, RefreshCcw, Code2, PenLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    isRunning: boolean;
    onBack: () => void;
    onRun: () => void;
    onSubmit: () => void;
    onOpenTutorial: () => void;
};

export function ActionBar({
    isRunning,
    onBack,
    onRun,
    onSubmit,
    onOpenTutorial,
}: Props) {
    return (
        <div className="flex justify-between">
            <div className="flex gap-2">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    一覧に戻る
                </Button>

                <Button variant="secondary" onClick={onOpenTutorial}>
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    チュートリアルを再確認
                </Button>
            </div>

            <Button variant="secondary" onClick={onRun} disabled={isRunning}>
                {isRunning ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                    <Code2 className="h-4 w-4 mr-1" />
                )}
                実行（出力テスト）
            </Button>

            <Button onClick={onSubmit}>
                <PenLine className="h-4 w-4 mr-1" />
                回答する
            </Button>
        </div>
    );
}
