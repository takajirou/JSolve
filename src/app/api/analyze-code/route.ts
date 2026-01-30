import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

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
            response.choices[0].message?.content || "解析できませんでした。";
        return NextResponse.json({ result });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "エラーが発生しました。" },
            { status: 500 }
        );
    }
}
