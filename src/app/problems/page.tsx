"use client";

import { useState } from "react";
import { useProblems } from "@/features/problems/hooks/useProblems";
import { ProblemsHeader } from "@/features/problems/components/ProblemsHeader";
import { ProblemsSummary } from "@/features/problems/components/ProblemsSummary";
import { ProblemsFilter } from "@/features/problems/components/ProblemsFilter";
import { ProblemCard } from "@/features/problems/components/ProblemCard";
import Loading from "@/components/ui/loading";

export default function ProblemsPage() {
    const { problems, categories, stats, loading } = useProblems();

    const [search, setSearch] = useState("");
    const [functionKey, setFunctionKey] = useState("全て");

    if (loading) return <Loading />;

    const filtered = problems.filter(
        (p) =>
            (functionKey === "全て" || p.functionKeys.includes(functionKey)) &&
            (p.title.includes(search) || p.description.includes(search)),
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
            <ProblemsHeader />

            <ProblemsSummary {...stats} total={filtered.length} />

            <ProblemsFilter
                searchText={search}
                onSearchChange={setSearch}
                categories={["全て", ...categories.map((c) => c.displayName)]}
                selectedCategory={functionKey}
                onSelectCategory={setFunctionKey}
            />

            <div className="space-y-8">
                {filtered.slice(0, 4).length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">基礎</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.slice(0, 4).map((p) => (
                                <ProblemCard key={p.id} problem={p} />
                            ))}
                        </div>
                    </div>
                )}

                {filtered.slice(4).length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">関数</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.slice(4).map((p) => (
                                <ProblemCard key={p.id} problem={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
