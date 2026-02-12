"use client";

import { useEffect, useState } from "react";
import { Problem, FunctionCategory, Difficulty } from "../types/problem";

type Stats = {
    easy: number;
    medium: number;
    hard: number;
};

export const useProblems = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [categories, setCategories] = useState<FunctionCategory[]>([]);
    const [stats, setStats] = useState<Stats>({
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch("/static/problems/index.json");
                const data: Problem[] = await res.json();

                setProblems(data);

                // stats 集計
                const s: Stats = { easy: 0, medium: 0, hard: 0 };
                data.forEach((p) => {
                    const key =
                        p.difficulty.toLowerCase() as Lowercase<Difficulty>;
                    s[key]++;
                });
                setStats(s);

                // functionKeys からカテゴリ生成
                const map = new Map<string, FunctionCategory>();
                data.forEach((p) => {
                    p.functionKeys.forEach((key) => {
                        if (!map.has(key)) {
                            map.set(key, {
                                key,
                                displayName: key,
                            });
                        }
                    });
                });
                setCategories([...map.values()]);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    return { problems, categories, stats, loading };
};
