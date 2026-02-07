"use client";

import { useState } from "react";

type ExecutionResult = {
    status: "SUCCESS" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "ERROR";
    stdout?: string;
    stderr?: string;
    expected?: string;
};

type RunResponse = {
    result?: string;
    stdout?: string;
    stderr?: string;
};

export const useCodeRunner = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<ExecutionResult | null>(null);

    const runSample = async (code: string, input: string, expected: string) => {
        setIsRunning(true);
        setResult(null);

        try {
            const response = await fetch("/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    input,
                }),
            });

            const data: RunResponse = await response.json();

            // タイムアウトチェック
            if (data.result === "TIME_LIMIT_EXCEEDED") {
                setResult({
                    status: "TIME_LIMIT_EXCEEDED",
                });
                return;
            }

            // エラーチェック
            if (data.stderr) {
                setResult({
                    status: "ERROR",
                    stderr: data.stderr,
                    stdout: data.stdout,
                });
                return;
            }

            // 出力比較（末尾の改行を無視）
            const actualOutput = (data.stdout || "").trim();
            const expectedOutput = expected.trim();

            if (actualOutput === expectedOutput) {
                setResult({
                    status: "SUCCESS",
                    stdout: data.stdout,
                });
            } else {
                setResult({
                    status: "WRONG_ANSWER",
                    stdout: data.stdout,
                    expected: expected,
                });
            }
        } catch (error) {
            setResult({
                status: "ERROR",
                stderr:
                    error instanceof Error
                        ? error.message
                        : "予期しないエラーが発生しました",
            });
        } finally {
            setIsRunning(false);
        }
    };

    const reset = () => {
        setResult(null);
    };

    return {
        isRunning,
        result,
        runSample,
        reset,
    };
};
