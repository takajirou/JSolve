import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Problem } from "../hooks/useProblems";

export function ProblemCard({ problem }: { problem: Problem }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Code2 className="h-5 w-5" />
                    {problem.functionName}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {problem.description}
                </p>
                <div className="flex gap-2">
                    <Badge>{problem.category}</Badge>
                    <Badge variant="secondary">{problem.difficulty}</Badge>
                </div>
                <Link href={`/problems/${problem.id}`}>
                    <Button className="w-full">
                        問題に挑戦する
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
