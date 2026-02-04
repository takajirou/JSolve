"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    attemptCount?: number;
};

type Stats = {
    total: number;
    easy: number;
    medium: number;
    hard: number;
};

type Category = {
    id: string;
    name: string;
    displayName: string;
    description: string;
    problemCount: number;
};

const iconMap: Record<string, React.ReactNode> = {
    入出力: <Code2 className="h-5 w-5 text-violet-500" />,
    "Set / Map": <Hash className="h-5 w-5 text-blue-500" />,
    "数値 / Math": <Sigma className="h-5 w-5 text-orange-500" />,
    文字列: <Code2 className="h-5 w-5 text-violet-500" />,
    ソート: <Layers className="h-5 w-5 text-emerald-500" />,
    ループ: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    アルゴリズム: <Brain className="h-5 w-5 text-purple-500" />,
    ビット演算: <Binary className="h-5 w-5 text-blue-500" />,
    配列操作: <Database className="h-5 w-5 text-teal-500" />,
    グラフ: <Brain className="h-5 w-5 text-indigo-500" />,
    DP: <Zap className="h-5 w-5 text-orange-500" />,
};

export default function CompetitiveProgrammingSite() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<string>("全て");
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<Difficulty | null>(null);
    const [selectedSection, setSelectedSection] = useState<string>("全て");
    const [selectedWebUsage, setSelectedWebUsage] = useState<"ALL" | WebUsage>(
        "ALL",
    );
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [problemsRes, categoriesRes, statsRes] = await Promise.all([
                fetch("/api/problems"),
                fetch("/api/categories"),
                fetch("/api/stats"),
            ]);
            console.log("fetch");

            const problemsData = await problemsRes.json();
            const categoriesData = await categoriesRes.json();
            const statsData = await statsRes.json();

            setProblems(problemsData.problems);
            setCategories(categoriesData.categories);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const categoryNames = useMemo(
        () => ["全て", ...categories.map((c) => c.displayName)],
        [categories],
    );

    const sections = useMemo(
        () => [
            "全て",
            ...Array.from(
                new Set(problems.map((p) => p.section).filter(Boolean)),
            ),
        ],
        [problems],
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">読み込み中...</p>
                </div>
            </div>
        );
    }

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
                        value={stats.easy.toString()}
                        gradient="from-blue-200 to-indigo-300"
                    />
                    <SummaryCard
                        icon={<Brain />}
                        title="MEDIUM"
                        value={stats.medium.toString()}
                        gradient="from-yellow-200 to-amber-300"
                    />
                    <SummaryCard
                        icon={<Zap />}
                        title="HARD"
                        value={stats.hard.toString()}
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
                            {categoryNames.map((c) => (
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
                                                    {iconMap[p.category] || (
                                                        <Code2 className="h-5 w-5" />
                                                    )}
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
                                                {p.attemptCount !== undefined &&
                                                    p.attemptCount > 0 && (
                                                        <Badge variant="outline">
                                                            {p.attemptCount}{" "}
                                                            回挑戦
                                                        </Badge>
                                                    )}
                                            </div>
                                            <Link href={`/problems/${p.id}`}>
                                                <Button className="w-full">
                                                    問題に挑戦する
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
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
