import {
    Brain,
    Flame,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Code,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
                {/* ===== Page Title ===== */}
                <div className="space-y-3 mb-2">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                        ダッシュボード
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        あなたの理解度に基づいた学習状況です
                    </p>
                </div>

                {/* ===== Summary ===== */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <SummaryCard
                        icon={<CheckCircle2 className="text-emerald-500" />}
                        title="習得済み"
                        value="24"
                        gradient="from-emerald-200 to-emerald-300"
                    />
                    <SummaryCard
                        icon={<AlertTriangle className="text-yellow-500" />}
                        title="理解が曖昧"
                        value="7"
                        gradient="from-yellow-200 to-amber-300"
                    />
                    <SummaryCard
                        icon={<Brain className="text-blue-500" />}
                        title="未学習"
                        value="31"
                        gradient="from-blue-200 to-indigo-300"
                    />
                    <SummaryCard
                        icon={<Flame className="text-orange-500" />}
                        title="連続学習日数"
                        value="5日"
                        gradient="from-orange-200 to-red-300"
                    />
                </div>

                {/* ===== Main Content ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Next Problem */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="h-5 w-5 text-violet-500" />
                                次に解くべき問題
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Badge variant="secondary">
                                    Array.prototype.map
                                </Badge>
                                <h3 className="font-semibold text-lg">
                                    配列を条件付きで変換せよ
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    難易度: EASY / 推定時間: 10分
                                </p>
                            </div>

                            <Button className="w-full">
                                問題を解く
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Uncertain Knowledge */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                理解が曖昧な処理
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                "Math.max",
                                "Array.prototype.reduce",
                                "Set / Map",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between rounded-lg border border-border p-4"
                                >
                                    <span>{item}</span>
                                    <Button size="sm" variant="secondary">
                                        復習
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Brain className="h-5 w-5 text-blue-500" />
                            AIおすすめ問題
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-border">
                                <CardContent className="p-5 space-y-4">
                                    <Badge variant="outline">String</Badge>
                                    <h4 className="font-semibold">
                                        文字列を条件に応じて加工する
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        難易度: MEDIUM
                                    </p>
                                    <Button size="sm" className="w-full">
                                        解く
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                {/* ===== CTA ===== */}
                <Card className="border-border mt-8">
                    <CardContent className="flex flex-col md:flex-row items-center justify-between gap-5 p-7">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                                <Code className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    問題を作成する
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    あなたの問題を他のユーザーに共有できます
                                </p>
                            </div>
                        </div>
                        <Button>作成する</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* ===== components ===== */

type SummaryCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    gradient: string;
};

function SummaryCard({ icon, title, value, gradient }: SummaryCardProps) {
    return (
        <Card className="border-border transition-transform hover:scale-105">
            <CardContent className="flex items-center gap-4">
                <div
                    className={`h-14 w-14 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center`}
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
