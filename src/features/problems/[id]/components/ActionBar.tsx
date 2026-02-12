"use client";

import { ArrowLeft, Play, Check, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
    isRunning: boolean;
    onBack: () => void;
    onRunSample: () => void;
    onSubmit: () => void;
    onOpenTutorial: () => void;
};

export function ActionBar({
    isRunning,
    onBack,
    onRunSample,
    onSubmit,
    onOpenTutorial,
}: Props) {
    return (
        <div className="border-b bg-card">
            <div className="flex items-center justify-between px-6 py-4">
                {/* 左側: 戻るボタン */}
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    一覧に戻る
                </Button>

                {/* 中央: チュートリアル */}
                <Button
                    variant="outline"
                    onClick={onOpenTutorial}
                    size="sm"
                    className="gap-2"
                >
                    <BookOpen className="h-4 w-4" />
                    チュートリアルを見る
                </Button>

                {/* 右側: 実行・提出ボタン */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={onRunSample}
                        disabled={isRunning}
                        size="sm"
                        className="gap-2"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                実行中...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                サンプル実行
                            </>
                        )}
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    <Button
                        onClick={onSubmit}
                        disabled={isRunning}
                        size="sm"
                        className="gap-2"
                    >
                        <Check className="h-4 w-4" />
                        提出する
                    </Button>
                </div>
            </div>
        </div>
    );
}
