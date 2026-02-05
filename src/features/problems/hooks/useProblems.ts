"use client";

import { useEffect, useState } from "react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type WebUsage = "LOW" | "NONE" | "DANGEROUS";

export type Problem = {
    id: string;
    functionName: string;
    description: string;
    category: string;
    section?: string;
    difficulty: Difficulty;
    webUsage: WebUsage;
    attemptCount?: number;
};

export type Category = {
    id: string;
    name: string;
    displayName: string;
};

type Stats = {
    total: number;
    easy: number;
    medium: number;
    hard: number;
};

export function useProblems() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [p, c, s] = await Promise.all([
                    fetch("/api/problems"),
                    fetch("/api/categories"),
                    fetch("/api/stats"),
                ]);

                const problemsData = await p.json();
                const categoriesData = await c.json();
                const statsData = await s.json();

                setProblems(problemsData.problems ?? []);
                setCategories(categoriesData.categories ?? []);
                setStats(statsData ?? stats);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { problems, categories, stats, loading };
}
