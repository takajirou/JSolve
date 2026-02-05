"use client";

import { useState } from "react";
import { useProblems } from "@/features/problems/hooks/useProblems";
import { ProblemsHeader } from "@/features/problems/components/ProblemsHeader";
import { ProblemsSummary } from "@/features/problems/components/ProblemsSummary";
import { ProblemsFilter } from "@/features/problems/components/ProblemsFilter";
import { ProblemCard } from "@/features/problems/components/ProblemCard";

export default function ProblemsPage() {
    const { problems, categories, stats, loading } = useProblems();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("全て");

    if (loading) return <div>Loading...</div>;

    const filtered = problems.filter(
        (p) =>
            (category === "全て" || p.category === category) &&
            p.functionName.includes(search),
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
            <ProblemsHeader />

            <ProblemsSummary {...stats} total={filtered.length} />

            <ProblemsFilter
                searchText={search}
                onSearchChange={setSearch}
                categories={["全て", ...categories.map((c) => c.displayName)]}
                selectedCategory={category}
                onSelectCategory={setCategory}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                    <ProblemCard key={p.id} problem={p} />
                ))}
            </div>
        </div>
    );
}
