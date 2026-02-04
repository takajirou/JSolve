import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const section = searchParams.get("section");
        const search = searchParams.get("search");

        // フィルター条件の構築
        const where: any = {};

        if (category && category !== "全て") {
            const categoryRecord = await prisma.category.findFirst({
                where: { displayName: category },
            });
            if (categoryRecord) {
                where.categoryId = categoryRecord.id;
            }
        }

        if (difficulty && difficulty !== "ALL") {
            where.difficulty = difficulty;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // 問題の取得
        const problems = await prisma.problem.findMany({
            where,
            include: {
                category: true,
                tags: true,
                _count: {
                    select: {
                        attempts: true,
                    },
                },
            },
            orderBy: [{ category: { order: "asc" } }, { difficulty: "asc" }],
        });

        // レスポンス形式に変換
        const formattedProblems = problems.map((problem) => ({
            id: problem.id,
            functionName: problem.title,
            description: problem.description,
            category: problem.category.displayName,
            section: problem.tags.find((t) =>
                [
                    "ビット全探索",
                    "二分探索",
                    "累積和",
                    "BFS",
                    "DFS",
                    "動的計画法",
                ].includes(t.name),
            )?.name,
            difficulty: problem.difficulty,
            webUsage: determineWebUsage(problem.category.name),
            attemptCount: problem._count.attempts,
        }));

        return NextResponse.json({
            problems: formattedProblems,
            total: formattedProblems.length,
        });
    } catch (error) {
        console.error("Error fetching problems:", error);
        return NextResponse.json(
            { error: "Failed to fetch problems" },
            { status: 500 },
        );
    }
}

function determineWebUsage(categoryName: string): "LOW" | "NONE" | "DANGEROUS" {
    const noneCategories = ["io", "bit"];
    const dangerousCategories = ["math"];

    if (noneCategories.includes(categoryName)) return "NONE";
    if (dangerousCategories.includes(categoryName)) return "DANGEROUS";
    return "LOW";
}
