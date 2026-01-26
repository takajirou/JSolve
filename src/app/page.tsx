"use client";

import React, { useState } from "react";
import {
    Brain,
    Code2,
    Binary,
    Database,
    ArrowRight,
    Filter,
    Zap,
    CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Problem = {
    id: string;
    functionName: string;
    description: string;
    category: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    webUsage: "LOW" | "NONE";
    icon: React.ReactNode;
};

const problems: Problem[] = [
    {
        id: "fs-read",
        functionName: "fs.readFileSync()",
        description:
            "標準入力を高速に処理し、競プロ用入力テンプレートを完成させよ",
        category: "入出力",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },
    {
        id: "process-stdin",
        functionName: "process.stdin",
        description: "ストリーム処理で標準入力を1行ずつ読み込め",
        category: "入出力",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },
    {
        id: "bit-search",
        functionName: "ビット全探索 (1 << n)",
        description: "ビット演算子を使い全組み合わせを列挙せよ",
        category: "ビット演算",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "bit-manipulation",
        functionName: "ビット演算 (&, |, ^, ~)",
        description:
            "popcount、最下位ビット取得など実用的なビット演算をマスターせよ",
        category: "ビット演算",
        difficulty: "HARD",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "map-count",
        functionName: "Map.prototype.get/set()",
        description: "配列内の要素出現回数を Map で管理せよ",
        category: "データ構造",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-emerald-500" />,
    },
    {
        id: "set-operations",
        functionName: "Set.prototype.has/add()",
        description: "和集合・積集合・差集合を Set で実装せよ",
        category: "データ構造",
        difficulty: "MEDIUM",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-emerald-500" />,
    },
    {
        id: "binary-search",
        functionName: "二分探索 (手書き実装)",
        description: "条件関数を用いた境界探索を実装せよ",
        category: "アルゴリズム",
        difficulty: "MEDIUM",
        webUsage: "LOW",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
        id: "gcd-lcm",
        functionName: "ユークリッド互除法 (GCD/LCM)",
        description: "最大公約数・最小公倍数を再帰で実装せよ",
        category: "アルゴリズム",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
        id: "prime-sieve",
        functionName: "エラトステネスの篩",
        description: "指定範囲内の素数を高速列挙せよ",
        category: "アルゴリズム",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
        id: "bigint-basics",
        functionName: "BigInt()",
        description: "通常の整数では扱えない巨大な数を計算せよ",
        category: "数値計算",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Zap className="h-5 w-5 text-orange-500" />,
    },
    {
        id: "modular-arithmetic",
        functionName: "剰余演算 (%, MOD)",
        description: "MOD演算の基本と逆元計算を実装せよ",
        category: "数値計算",
        difficulty: "HARD",
        webUsage: "NONE",
        icon: <Zap className="h-5 w-5 text-orange-500" />,
    },
    {
        id: "array-fill-2d",
        functionName: "Array.from()",
        description: "様々なパターンで2次元配列を効率的に生成せよ",
        category: "配列操作",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-teal-500" />,
    },
];

export default function CompetitiveProgrammingSite() {
    const [selectedCategory, setSelectedCategory] = useState<string>("全て");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
        null,
    );

    const categories = [
        "全て",
        "入出力",
        "ビット演算",
        "データ構造",
        "アルゴリズム",
        "数値計算",
        "配列操作",
    ];

    const filteredProblems = problems.filter((problem) => {
        const categoryMatch =
            selectedCategory === "全て" ||
            problem.category === selectedCategory;
        const difficultyMatch =
            !selectedDifficulty || problem.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
                {/* ===== Page Title ===== */}
                <div className="space-y-3 mb-2">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                        問題一覧
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Webでは使わないが、競技プログラミングでは必須の知識
                    </p>
                </div>

                {/* ===== Summary ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <SummaryCard
                        icon={<CheckCircle2 className="text-emerald-500" />}
                        title="問題数"
                        value={problems.length.toString()}
                        gradient="from-emerald-200 to-emerald-300"
                    />
                    <SummaryCard
                        icon={<Code2 className="text-blue-500" />}
                        title="EASY"
                        value={problems
                            .filter((p) => p.difficulty === "EASY")
                            .length.toString()}
                        gradient="from-blue-200 to-indigo-300"
                    />
                    <SummaryCard
                        icon={<Brain className="text-yellow-500" />}
                        title="MEDIUM"
                        value={problems
                            .filter((p) => p.difficulty === "MEDIUM")
                            .length.toString()}
                        gradient="from-yellow-200 to-amber-300"
                    />
                    <SummaryCard
                        icon={<Zap className="text-orange-500" />}
                        title="HARD"
                        value={problems
                            .filter((p) => p.difficulty === "HARD")
                            .length.toString()}
                        gradient="from-orange-200 to-red-300"
                    />
                </div>

                {/* ===== Filters ===== */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Filter className="h-5 w-5 text-violet-500" />
                            フィルター
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* カテゴリフィルター */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                カテゴリ
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={
                                            selectedCategory === category
                                                ? "default"
                                                : "secondary"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* 難易度フィルター */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                難易度
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={
                                        !selectedDifficulty
                                            ? "default"
                                            : "secondary"
                                    }
                                    size="sm"
                                    onClick={() => setSelectedDifficulty(null)}
                                >
                                    全難易度
                                </Button>
                                {["EASY", "MEDIUM", "HARD"].map((diff) => (
                                    <Button
                                        key={diff}
                                        variant={
                                            selectedDifficulty === diff
                                                ? "default"
                                                : "secondary"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setSelectedDifficulty(diff)
                                        }
                                    >
                                        {diff}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground pt-2">
                            {filteredProblems.length}件の問題を表示中
                        </p>
                    </CardContent>
                </Card>

                {/* ===== Problem List ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProblems.map((problem) => (
                        <Card
                            key={problem.id}
                            className="border-border transition-transform hover:scale-[1.02]"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                        {problem.icon}
                                    </div>
                                    <span className="text-base">
                                        {problem.functionName}
                                    </span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {problem.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">
                                        {problem.category}
                                    </Badge>

                                    <Badge
                                        variant={
                                            problem.difficulty === "EASY"
                                                ? "outline"
                                                : problem.difficulty ===
                                                    "MEDIUM"
                                                  ? "default"
                                                  : "destructive"
                                        }
                                    >
                                        {problem.difficulty}
                                    </Badge>

                                    {problem.webUsage === "NONE" && (
                                        <Badge variant="destructive">
                                            Webでは使わない
                                        </Badge>
                                    )}

                                    {problem.webUsage === "LOW" && (
                                        <Badge variant="secondary">
                                            Web使用頻度低
                                        </Badge>
                                    )}
                                </div>

                                <Button className="w-full">
                                    問題に挑戦する
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredProblems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        条件に一致する問題が見つかりませんでした
                    </div>
                )}
            </div>
        </div>
    );
}

/* ===== Components ===== */

type SummaryCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    gradient: string;
};

function SummaryCard({ icon, title, value, gradient }: SummaryCardProps) {
    return (
        <Card className="border-border transition-transform hover:scale-105">
            <CardContent className="flex items-center gap-4 p-5">
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
