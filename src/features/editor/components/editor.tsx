"use client";

import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

const MonacoEditor = dynamic<EditorProps>(
    () => import("@monaco-editor/react"),
    { ssr: false },
);

type CodeEditorProps = {
    value: string;
    onChange: (value: string) => void;
    language?: string;
    height?: string;
};

export function CodeEditor({
    value,
    onChange,
    language = "javascript",
    height = "100%",
}: CodeEditorProps) {
    return (
        <MonacoEditor
            height={height}
            language={language}
            value={value}
            onChange={(val) => onChange(val ?? "")}
            theme="vs-dark"
            options={{
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false },
            }}
        />
    );
}
