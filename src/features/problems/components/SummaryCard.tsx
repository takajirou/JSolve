import { Card, CardContent } from "@/components/ui/card";
type SummaryCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number;
    gradient: string;
};

export function SummaryCard({
    icon,
    title,
    value,
    gradient,
}: SummaryCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-5">
                <div
                    className={`h-14 w-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
