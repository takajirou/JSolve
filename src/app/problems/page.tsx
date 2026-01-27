"use client";

import React, { useMemo, useState } from "react";
import {
    Brain,
    Code2,
    Binary,
    Database,
    ArrowRight,
    Filter,
    Zap,
    CheckCircle2,
    Search,
    Hash,
    Sigma,
    Layers,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type WebUsage = "LOW" | "NONE" | "DANGEROUS";

type Problem = {
    id: string;
    functionName: string;
    description: string;
    category: string;
    section?: string;
    difficulty: Difficulty;
    webUsage: WebUsage;
    icon: React.ReactNode;
};

const problems: Problem[] = [
    /* ===== 入出力 ===== */
    {
        id: "fs-read",
        functionName: "fs.readFileSync()",
        description: "標準入力を高速に読み込め",
        category: "入出力",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },
    {
        id: "process-stdin",
        functionName: "process.stdin.on('data')",
        description: "ストリームとして標準入力を扱え",
        category: "入出力",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },
    {
        id: "new-set-basic",
        functionName: "new Set の基本",
        description: "Set を使って重複チェックを行え",
        category: "Set / Map",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Hash className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "map-get-default",
        functionName: "Map.get ?? 0 の基本",
        description: "未定義キーを考慮した安全な加算を行え",
        category: "Set / Map",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-blue-500" />,
    },

    // ===== Math / 数値 =====
    {
        id: "math-min",
        functionName: "Math.min を for-loop で使う",
        description: "スプレッド構文を使わず最小値を求めよ",
        category: "数値 / Math",
        difficulty: "EASY",
        webUsage: "DANGEROUS",
        icon: <Sigma className="h-5 w-5 text-orange-500" />,
    },
    {
        id: "max-safe-integer",
        functionName: "Number.MAX_SAFE_INTEGER を使う",
        description: "無限大の初期値として正しく利用せよ",
        category: "数値 / Math",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Sigma className="h-5 w-5 text-orange-500" />,
    },

    // ===== 文字列 =====
    {
        id: "char-code-at",
        functionName: "charCodeAt で文字を数値に変換",
        description: "a〜z を 0〜25 に変換せよ",
        category: "文字列",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },
    {
        id: "parse-int-radix",
        functionName: "parseInt の基数を指定する",
        description: "10進数として安全に数値変換せよ",
        category: "文字列",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Code2 className="h-5 w-5 text-violet-500" />,
    },

    // ===== ソート =====
    {
        id: "numeric-sort",
        functionName: "数値ソートの基本",
        description: "比較関数を指定して昇順ソートせよ",
        category: "ソート",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Layers className="h-5 w-5 text-emerald-500" />,
    },

    // ===== ループ =====
    {
        id: "for-loop-basic",
        functionName: "for-loop の基本",
        description: "for 文を使って配列を走査せよ",
        category: "ループ",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    {
        id: "break-continue",
        functionName: "break / continue の使い分け",
        description: "ループ制御を正しく行え",
        category: "ループ",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },

    // ===== アルゴリズム超入門 =====
    {
        id: "prefix-sum-basic",
        functionName: "累積和の基本",
        description: "一次元配列の累積和を構築せよ",
        category: "アルゴリズム",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Brain className="h-5 w-5 text-purple-500" />,
    },

    /* ===== ビット全探索 ===== */
    {
        id: "bit-shift-n",
        functionName: "(1 << n)",
        description: "部分集合の総数を求めよ",
        category: "ビット演算",
        section: "ビット全探索",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "bit-mask-check",
        functionName: "mask & (1 << i)",
        description: "i 番目の要素が選ばれているか判定せよ",
        category: "ビット演算",
        section: "ビット全探索",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "bit-enumerate",
        functionName: "for (mask < (1 << n))",
        description: "すべての部分集合を列挙せよ",
        category: "ビット演算",
        section: "ビット全探索",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },
    {
        id: "bit-popcount",
        functionName: "popcount (自作)",
        description: "立っているビット数を数えよ",
        category: "ビット演算",
        section: "ビット全探索",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Binary className="h-5 w-5 text-blue-500" />,
    },

    /* ===== 二分探索 ===== */
    {
        id: "binary-search-basic",
        functionName: "while (l < r)",
        description: "単調性を用いた二分探索を実装せよ",
        category: "アルゴリズム",
        section: "二分探索",
        difficulty: "MEDIUM",
        webUsage: "LOW",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
        id: "binary-search-lowerbound",
        functionName: "lower_bound",
        description: "条件を満たす最小の index を求めよ",
        category: "アルゴリズム",
        section: "二分探索",
        difficulty: "MEDIUM",
        webUsage: "LOW",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },

    /* ===== 累積和 ===== */
    {
        id: "prefix-sum-1d",
        functionName: "prefix[i] = prefix[i-1] + a[i]",
        description: "1 次元累積和を構築せよ",
        category: "配列操作",
        section: "累積和",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-teal-500" />,
    },
    {
        id: "prefix-sum-range",
        functionName: "sum[l..r]",
        description: "区間和を O(1) で求めよ",
        category: "配列操作",
        section: "累積和",
        difficulty: "EASY",
        webUsage: "LOW",
        icon: <Database className="h-5 w-5 text-teal-500" />,
    },

    /* ===== BFS / DFS ===== */
    {
        id: "bfs-queue",
        functionName: "queue.shift()",
        description: "幅優先探索を実装せよ",
        category: "グラフ",
        section: "BFS",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
        id: "dfs-recursive",
        functionName: "dfs(v)",
        description: "再帰で深さ優先探索を行え",
        category: "グラフ",
        section: "DFS",
        difficulty: "EASY",
        webUsage: "NONE",
        icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },

    /* ===== DP ===== */
    {
        id: "dp-array",
        functionName: "dp[i]",
        description: "配る DP の基本形を実装せよ",
        category: "DP",
        section: "動的計画法",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Zap className="h-5 w-5 text-orange-500" />,
    },
    {
        id: "dp-transition",
        functionName: "dp[i] = min(dp[i-1], dp[i-2])",
        description: "遷移式を設計せよ",
        category: "DP",
        section: "動的計画法",
        difficulty: "MEDIUM",
        webUsage: "NONE",
        icon: <Zap className="h-5 w-5 text-orange-500" />,
    },
];

export default function CompetitiveProgrammingSite() {
    const [selectedCategory, setSelectedCategory] = useState<string>("全て");
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<Difficulty | null>(null);
    const [selectedSection, setSelectedSection] = useState<string>("全て");
    const [selectedWebUsage, setSelectedWebUsage] = useState<"ALL" | WebUsage>(
        "ALL",
    );
    const [searchText, setSearchText] = useState<string>("");

    const categories = useMemo(
        () => ["全て", ...Array.from(new Set(problems.map((p) => p.category)))],
        [],
    );

    const sections = useMemo(
        () => [
            "全て",
            ...Array.from(
                new Set(problems.map((p) => p.section).filter(Boolean)),
            ),
        ],
        [],
    );

    const filteredProblems = problems.filter((p) => {
        const categoryMatch =
            selectedCategory === "全て" || p.category === selectedCategory;
        const difficultyMatch =
            !selectedDifficulty || p.difficulty === selectedDifficulty;
        const sectionMatch =
            selectedSection === "全て" || p.section === selectedSection;
        const webUsageMatch =
            selectedWebUsage === "ALL" || p.webUsage === selectedWebUsage;
        const searchMatch =
            p.functionName.toLowerCase().includes(searchText.toLowerCase()) ||
            p.description.toLowerCase().includes(searchText.toLowerCase());

        return (
            categoryMatch &&
            difficultyMatch &&
            sectionMatch &&
            webUsageMatch &&
            searchMatch
        );
    });

    const groupedProblems = filteredProblems.reduce<Record<string, Problem[]>>(
        (acc, p) => {
            const key = p.section ?? "__NO_SECTION__";
            if (!acc[key]) acc[key] = [];
            acc[key].push(p);
            return acc;
        },
        {},
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
                {/* ===== Title ===== */}
                <div>
                    <h1 className="text-4xl font-bold">問題一覧</h1>
                    <p className="text-muted-foreground">
                        競技プログラミング必須関数・構文カタログ
                    </p>
                </div>

                {/* ===== Summary ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <SummaryCard
                        icon={<CheckCircle2 />}
                        title="問題数"
                        value={filteredProblems.length.toString()}
                        gradient="from-emerald-200 to-emerald-300"
                    />
                    <SummaryCard
                        icon={<Code2 />}
                        title="EASY"
                        value={problems
                            .filter((p) => p.difficulty === "EASY")
                            .length.toString()}
                        gradient="from-blue-200 to-indigo-300"
                    />
                    <SummaryCard
                        icon={<Brain />}
                        title="MEDIUM"
                        value={problems
                            .filter((p) => p.difficulty === "MEDIUM")
                            .length.toString()}
                        gradient="from-yellow-200 to-amber-300"
                    />
                    <SummaryCard
                        icon={<Zap />}
                        title="HARD"
                        value={problems
                            .filter((p) => p.difficulty === "HARD")
                            .length.toString()}
                        gradient="from-orange-200 to-red-300"
                    />
                </div>

                {/* ===== Filters ===== */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            フィルター
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="関数名・説明で検索"
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Category */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <Button
                                    key={c}
                                    size="sm"
                                    variant={
                                        selectedCategory === c
                                            ? "default"
                                            : "secondary"
                                    }
                                    onClick={() => setSelectedCategory(c)}
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>

                        {/* Section */}
                        <div className="flex flex-wrap gap-2">
                            {sections.map((s) => (
                                <Button
                                    key={s}
                                    size="sm"
                                    variant={
                                        selectedSection === s
                                            ? "default"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setSelectedSection(String(s))
                                    }
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>

                        {/* Difficulty */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant={
                                    !selectedDifficulty
                                        ? "default"
                                        : "secondary"
                                }
                                onClick={() => setSelectedDifficulty(null)}
                            >
                                全難易度
                            </Button>
                            {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map(
                                (d) => (
                                    <Button
                                        key={d}
                                        size="sm"
                                        variant={
                                            selectedDifficulty === d
                                                ? "default"
                                                : "secondary"
                                        }
                                        onClick={() => setSelectedDifficulty(d)}
                                    >
                                        {d}
                                    </Button>
                                ),
                            )}
                        </div>

                        {/* Web Usage */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "すべて", value: "ALL" },
                                { label: "Webでは使わない", value: "NONE" },
                                { label: "Web使用頻度低", value: "LOW" },
                            ].map(({ label, value }) => (
                                <Button
                                    key={value}
                                    size="sm"
                                    variant={
                                        selectedWebUsage === value
                                            ? "default"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setSelectedWebUsage(
                                            value as "ALL" | WebUsage,
                                        )
                                    }
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ===== List ===== */}
                <div className="space-y-12">
                    {Object.entries(groupedProblems).map(([section, list]) => (
                        <div key={section} className="space-y-4">
                            {section !== "__NO_SECTION__" && (
                                <h2 className="text-2xl font-bold border-l-4 pl-4">
                                    {section}
                                </h2>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {list.map((p) => (
                                    <Card key={p.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    {p.icon}
                                                </div>
                                                {p.functionName}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                {p.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary">
                                                    {p.category}
                                                </Badge>
                                                <Badge>{p.difficulty}</Badge>
                                            </div>
                                            <Button className="w-full">
                                                問題に挑戦する
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

type SummaryCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    gradient: string;
};

function SummaryCard({ icon, title, value, gradient }: SummaryCardProps) {
    return (
        <Card>
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
