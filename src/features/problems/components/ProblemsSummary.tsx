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
            <SummaryCard icon={<CheckCircle2 />} title="問題数" value={total} />
            <SummaryCard icon={<Code2 />} title="EASY" value={easy} />
            <SummaryCard icon={<Brain />} title="MEDIUM" value={medium} />
            <SummaryCard icon={<Zap />} title="HARD" value={hard} />
        </div>
    );
}
