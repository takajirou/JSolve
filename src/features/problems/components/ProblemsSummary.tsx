import { Brain, CheckCircle2, Code2, Zap } from "lucide-react";
import { SummaryCard } from "./SummaryCard";

type Props = {
    total: number;
    easy: number;
    medium: number;
    hard: number;
};

export function ProblemsSummary({ total, easy, medium, hard }: Props) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <SummaryCard
                icon={<CheckCircle2 />}
                title="問題数"
                value={total}
                gradient="from-blue-500 to-blue-700"
            />
            <SummaryCard
                icon={<Code2 />}
                title="EASY"
                value={easy}
                gradient="from-green-400 to-green-600"
            />
            <SummaryCard
                icon={<Brain />}
                title="MEDIUM"
                value={medium}
                gradient="from-yellow-400 to-yellow-600"
            />
            <SummaryCard
                icon={<Zap />}
                title="HARD"
                value={hard}
                gradient="from-red-400 to-red-600"
            />
        </div>
    );
}
