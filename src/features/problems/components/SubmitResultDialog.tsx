import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

type FunctionCheck = {
    functionName: string;
    isUsed: boolean;
    explanation: string;
};

type CaseResult = {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
};

type Props = {
    open: boolean;
    success: boolean;
    functionChecks?: FunctionCheck[];
    feedback?: string;
    caseResults: CaseResult[];
    onClose: () => void;
    onRetry?: () => void;
};

export function SubmitResultDialog({
    open,
    success,
    functionChecks = [],
    feedback = "",
    onClose,
    onRetry,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {success ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                        )}
                        <DialogTitle>
                            {success ? "正解です！🎉" : "もう少しです！"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {success ? (
                        <DialogDescription>
                            素晴らしい！すべての必須関数を正しく使用してコードを完成させました。
                        </DialogDescription>
                    ) : (
                        <>
                            <div className="text-foreground font-medium">
                                関数の使用状況：
                            </div>
                            <div className="space-y-2">
                                {functionChecks.map((check) => (
                                    <div
                                        key={check.functionName}
                                        className={`p-3 rounded-lg border ${
                                            check.isUsed
                                                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {check.isUsed ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-mono font-semibold text-sm text-foreground">
                                                    {check.functionName}()
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {check.explanation}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {feedback && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="text-sm text-foreground leading-relaxed">
                                        💡 {feedback}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {success ? (
                        <Button>
                            <Link href="/problems" className="w-full">
                                問題一覧に戻る
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:w-auto"
                            >
                                閉じる
                            </Button>
                            {onRetry && (
                                <Button
                                    onClick={onRetry}
                                    className="w-full sm:w-auto"
                                >
                                    もう一度挑戦
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
