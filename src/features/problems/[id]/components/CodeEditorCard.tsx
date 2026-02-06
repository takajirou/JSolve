"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/features/editor/components/editor";

type Props = {
    code: string;
    onChange: (value: string) => void;
};

export function CodeEditorCard({ code, onChange }: Props) {
    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>コードエディタ</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <CodeEditor
                    value={code}
                    onChange={onChange}
                    language="typescript"
                    height="100%"
                />
            </CardContent>
        </Card>
    );
}
