"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Problem } from "../../types/problem";

type Props = {
    problem: Problem;
};

export function ProblemCard({ problem }: Props) {
    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>問題文</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                </div>

                {problem.constraints && (
                    <section className="border-t pt-4">
                        <h3 className="font-semibold mb-2">制約</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {problem.constraints}
                        </p>
                    </section>
                )}

                <section className="border-t pt-4">
                    <h3 className="font-semibold mb-2">入力例</h3>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        {problem.sampleInput}
                    </pre>
                </section>

                <section>
                    <h3 className="font-semibold mb-2">出力例</h3>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        {problem.sampleOutput}
                    </pre>
                </section>

                <section className="border-t pt-4">
                    <h3 className="font-semibold mb-2">制限</h3>
                    <p className="text-sm text-muted-foreground">
                        実行時間制限: {problem.timeLimit}ms
                    </p>
                    <p className="text-sm text-muted-foreground">
                        メモリ制限: {problem.memoryLimit}MB
                    </p>
                </section>
            </CardContent>
        </Card>
    );
}
