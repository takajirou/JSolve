"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

const defaultCode = `
function main(input) {
    console.log(input);
}

main([""]);
`;

export default function CodeRunnerAndAnalyzer() {
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState<string>("");
    const [analysis, setAnalysis] = useState<string>("");

    // JSコード実行
    const runCode = () => {
        const consoleOutput: string[] = [];
        const originalConsoleLog = console.log;

        console.log = (...args: any[]) => {
            consoleOutput.push(args.join(" "));
        };

        try {
            new Function(code)();
        } catch (err) {
            consoleOutput.push("エラー: " + err);
        }

        console.log = originalConsoleLog;
        setOutput(consoleOutput.join("\n"));
    };

    // OpenAIでコード分析
    const analyzeCode = async () => {
        setAnalysis("解析中...");
        try {
            const res = await fetch("/api/analyze-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            setAnalysis(data.result || data.error);
        } catch (err) {
            setAnalysis("通信エラー");
        }
    };

    return (
        <div>
            <MonacoEditor
                height="400px"
                language="javascript"
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{ automaticLayout: true }}
            />

            <div style={{ marginTop: "10px" }}>
                <button
                    onClick={runCode}
                    style={{
                        marginRight: "10px",
                        padding: "8px 16px",
                        cursor: "pointer",
                    }}
                >
                    実行
                </button>
                <button
                    onClick={analyzeCode}
                    style={{ padding: "8px 16px", cursor: "pointer" }}
                >
                    コード分析
                </button>
            </div>

            <h3 style={{ marginTop: "20px" }}>実行結果</h3>
            <pre
                style={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    padding: "10px",
                    minHeight: "100px",
                }}
            >
                {output}
            </pre>

            <h3 style={{ marginTop: "20px" }}>分析結果</h3>
            <pre
                style={{
                    backgroundColor: "#2e2e2e",
                    color: "#fff",
                    padding: "10px",
                    minHeight: "150px",
                }}
            >
                {analysis}
            </pre>
        </div>
    );
}
