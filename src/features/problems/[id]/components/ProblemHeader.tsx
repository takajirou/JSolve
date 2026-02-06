"use client";

import { Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Problem } from "../../types/problem";

type Props = {
    problem: Problem;
};

export function ProblemHeader({ problem }: Props) {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Code2 className="h-7 w-7 text-violet-500" />
                {problem.title}
            </h1>

            <div className="flex gap-2 flex-wrap">
                <Badge>{problem.category.name}</Badge>
                <Badge variant="secondary">難易度: {problem.difficulty}</Badge>
                {problem.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                        {tag.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
