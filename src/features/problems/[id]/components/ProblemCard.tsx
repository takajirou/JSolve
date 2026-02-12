"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Problem, StaticTestCases } from "../../types/problem";

type Props = {
    problem: Problem;
    testcases: StaticTestCases;
};

const difficultyColors = {
    EASY: "bg-green-500/10 text-green-700 border-green-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    HARD: "bg-red-500/10 text-red-700 border-red-500/20",
};

const difficultyLabels = {
    EASY: "初級",
    MEDIUM: "中級",
    HARD: "上級",
};

export function ProblemCard({ problem, testcases }: Props) {
    const sample = testcases.cases[0];

    return (
        <Card className="h-[600px] flex flex-col shadow-sm">
            <CardHeader className="border-b bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                            {problem.title}
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                            <Badge
                                variant="outline"
                                className={
                                    difficultyColors[
                                        problem.difficulty as keyof typeof difficultyColors
                                    ]
                                }
                            >
                                {
                                    difficultyLabels[
                                        problem.difficulty as keyof typeof difficultyLabels
                                    ]
                                }
                            </Badge>
                            {problem.functionKeys.map((key) => (
                                <Badge
                                    key={key}
                                    variant="secondary"
                                    className="font-mono text-xs"
                                >
                                    {key}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 問題文 */}
                <section>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                        問題
                    </h3>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {problem.description}
                    </div>
                </section>

                {/* 入力例 */}
                {sample && (
                    <section className="border-t pt-6">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                            入力例
                        </h3>
                        <pre className="bg-muted/50 border p-4 rounded-lg text-sm overflow-x-auto font-mono">
                            {sample.input}
                        </pre>
                    </section>
                )}

                {/* 出力例 */}
                {sample && (
                    <section className="border-t pt-6">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                            出力例
                        </h3>
                        <pre className="bg-muted/50 border p-4 rounded-lg text-sm overflow-x-auto font-mono">
                            {sample.output}
                        </pre>
                    </section>
                )}
            </CardContent>
        </Card>
    );
}
