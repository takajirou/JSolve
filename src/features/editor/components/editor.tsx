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

export default function CodeRunner() {
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState<string>("");

    const runCode = () => {
        const consoleOutput: string[] = [];
        // console.log を上書き
        const originalConsoleLog = console.log;
        console.log = (...args: any[]) => {
            consoleOutput.push(args.join(" "));
        };

        try {
            // ブラウザ上で JS を実行
            new Function(code)();
        } catch (err) {
            consoleOutput.push("エラー: " + err);
        }

        // console.log を元に戻す
        console.log = originalConsoleLog;
        setOutput(consoleOutput.join("\n"));
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
            <button
                onClick={runCode}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    cursor: "pointer",
                }}
            >
                実行
            </button>
            <pre
                style={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    padding: "10px",
                    marginTop: "10px",
                    minHeight: "100px",
                }}
            >
                {output}
            </pre>
        </div>
    );
}
