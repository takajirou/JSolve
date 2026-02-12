"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    output: string;
};

export function RunOutputCard({ output }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>実行結果（サンプル入力）</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                    {output}
                </pre>
            </CardContent>
        </Card>
    );
}
