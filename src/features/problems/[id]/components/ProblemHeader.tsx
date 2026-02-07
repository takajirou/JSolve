"use client";

import { Code2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StaticProblem } from "../../types/problem";

type Props = {
    problem: StaticProblem;
};

export function ProblemHeader({ problem }: Props) {
    return (
        <div className="space-y-3">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Code2 className="h-7 w-7 text-violet-500" />
                {problem.title}
            </h1>

            <div className="flex gap-2 flex-wrap items-center">
                <Badge variant="secondary">難易度: {problem.difficulty}</Badge>

                {problem.functionKeys.map((key) => (
                    <Badge key={key} className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {key}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
