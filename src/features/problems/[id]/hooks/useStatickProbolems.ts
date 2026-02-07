"use client";
import { useEffect, useState } from "react";
import {
    Problem,
    StaticTutorial,
    StaticTestCases,
} from "@/features/problems/types/problem";

export const useStaticProblem = (id: string) => {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [tutorial, setTutorial] = useState<StaticTutorial | null>(null);
    const [testcases, setTestcases] = useState<StaticTestCases | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await fetch(`/static/problems/${id}.json`).then(
                    (r) => r.json(),
                );

                setProblem({
                    id: data.id || data.staticKey,
                    title: data.title,
                    description: data.description,
                    difficulty: data.difficulty,
                    functionKeys: data.functionKeys,
                    hasTutorial: data.hints && data.hints.length > 0,
                });

                // チュートリアルデータ（hintsから変換）
                if (data.hints && data.hints.length > 0) {
                    setTutorial({
                        staticKey: data.id || data.staticKey,
                        functionKey: data.functionKeys[0],
                        dialog: data.hints,
                    });
                } else {
                    setTutorial(null);
                }

                // テストケースデータ
                setTestcases({
                    staticKey: data.id || data.staticKey,
                    cases: data.cases,
                });
            } catch (error) {
                console.error("Failed to fetch problem data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    return { problem, tutorial, testcases, loading };
};
