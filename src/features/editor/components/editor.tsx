"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

const defaultCode = `// 入力処理
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line);
}).on('close', () => {
    main(input);
});

function main(input) {
    // ここに処理を入力
    console.log("Hello, world!");
}
`;

export default function CodeEditor() {
    const [code, setCode] = useState(defaultCode);

    return (
        <MonacoEditor
            height="500px"
            language="javascript"
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
                automaticLayout: true,
                fontSize: 14,
            }}
        />
    );
}
