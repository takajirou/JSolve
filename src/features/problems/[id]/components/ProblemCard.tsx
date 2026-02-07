"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaticProblem, StaticTestCases } from "../../types/problem";

type Props = {
    problem: StaticProblem;
    testcases: StaticTestCases;
};

export function ProblemCard({ problem, testcases }: Props) {
    const sample = testcases.cases[0];

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>問題文</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-6">
                {/* 問題文 */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                </div>

                {/* 入力例 */}
                {sample && (
                    <section className="border-t pt-4">
                        <h3 className="font-semibold mb-2">入力例</h3>
                        <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                            {sample.input}
                        </pre>
                    </section>
                )}

                {/* 出力例 */}
                {sample && (
                    <section>
                        <h3 className="font-semibold mb-2">出力例</h3>
                        <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                            {sample.output}
                        </pre>
                    </section>
                )}
            </CardContent>
        </Card>
    );
}
