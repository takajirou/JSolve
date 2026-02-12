"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExecutionResultProps = {
    result: {
        status: "SUCCESS" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "ERROR";
        stdout?: string;
        stderr?: string;
        expected?: string;
    } | null;
};

export function ExecutionResult({ result }: ExecutionResultProps) {
    if (!result) return null;

    const statusConfig = {
        SUCCESS: {
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50 border-green-200",
            label: "実行成功",
            badgeVariant: "default" as const,
        },
        WRONG_ANSWER: {
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 border-red-200",
            label: "不正解",
            badgeVariant: "destructive" as const,
        },
        TIME_LIMIT_EXCEEDED: {
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 border-yellow-200",
            label: "実行時間超過",
            badgeVariant: "secondary" as const,
        },
        ERROR: {
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50 border-red-200",
            label: "実行エラー",
            badgeVariant: "destructive" as const,
        },
    };

    const config = statusConfig[result.status];
    const Icon = config.icon;

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        実行結果
                    </CardTitle>
                    <Badge variant={config.badgeVariant} className="gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* 標準出力 */}
                {result.stdout && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            出力
                        </h4>
                        <ScrollArea className="h-32 w-full rounded-md border bg-muted/30">
                            <pre className="p-4 text-sm font-mono">
                                {result.stdout}
                            </pre>
                        </ScrollArea>
                    </div>
                )}

                {/* 期待される出力 */}
                {result.expected && result.status === "WRONG_ANSWER" && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            期待される出力
                        </h4>
                        <ScrollArea className="h-32 w-full rounded-md border bg-green-50/50">
                            <pre className="p-4 text-sm font-mono">
                                {result.expected}
                            </pre>
                        </ScrollArea>
                    </div>
                )}

                {/* エラー出力 */}
                {result.stderr && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <ScrollArea className="h-24 w-full mt-2">
                                <pre className="text-xs font-mono whitespace-pre-wrap">
                                    {result.stderr}
                                </pre>
                            </ScrollArea>
                        </AlertDescription>
                    </Alert>
                )}

                {/* タイムアウトメッセージ */}
                {result.status === "TIME_LIMIT_EXCEEDED" && (
                    <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                            実行時間が制限時間（2秒）を超過しました。無限ループや計算量の多い処理が含まれていないか確認してください。
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
