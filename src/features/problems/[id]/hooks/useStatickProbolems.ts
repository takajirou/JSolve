"use client";
import { useEffect, useState } from "react";
import {
    StaticProblem,
    StaticTutorial,
    StaticTestCases,
} from "@/features/problems/types/problem";

export const useStaticProblem = (id: string) => {
    const [problem, setProblem] = useState<StaticProblem | null>(null);
    const [tutorial, setTutorial] = useState<StaticTutorial | null>(null);
    const [testcases, setTestcases] = useState<StaticTestCases | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [p, t, c] = await Promise.all([
                    fetch(`/static/problems/${id}.json`).then((r) => r.json()),
                    fetch(`/static/problem_tutorials/${id}.json`).then((r) =>
                        r.ok ? r.json() : null,
                    ),
                    fetch(`/static/testcases/${id}.json`).then((r) => r.json()),
                ]);

                setProblem(p);
                setTutorial(t);
                setTestcases(c);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    return { problem, tutorial, testcases, loading };
};
