import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type AnalyzeCodeRequestBody = {
    code: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: unknown = await req.json();

        if (
            typeof body !== "object" ||
            body === null ||
            !("code" in body) ||
            typeof (body as AnalyzeCodeRequestBody).code !== "string"
        ) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 },
            );
        }

        const { code } = body as AnalyzeCodeRequestBody;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "あなたは優秀なコードレビュアーです。",
                },
                {
                    role: "user",
                    content: `以下のJavaScriptコードを分析してどんなコードか分析してください:\n\n${code}`,
                },
            ],
            temperature: 0.2,
        });

        const result =
            response.choices[0]?.message?.content ?? "解析できませんでした。";

        return NextResponse.json({ result });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "エラーが発生しました。";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
