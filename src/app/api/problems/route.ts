import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

const isDifficultyLevel = (value: string): value is DifficultyLevel => {
    return Object.values(DifficultyLevel).includes(value as DifficultyLevel);
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const difficulty = searchParams.get("difficulty");
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const where: Prisma.ProblemWhereInput = {};

        if (
            difficulty &&
            difficulty !== "ALL" &&
            isDifficultyLevel(difficulty)
        ) {
            where.difficulty = difficulty;
        }

        if (category && category !== "全て") {
            const categoryRecord = await prisma.category.findFirst({
                where: { displayName: category },
            });

            if (categoryRecord) {
                where.categoryId = categoryRecord.id;
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

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
    } catch (error: unknown) {
        console.error("Error fetching problems:", error);

        // より詳細なエラー情報を返す
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Detailed error:", errorMessage);

        return NextResponse.json(
            {
                error: "Failed to fetch problems",
                details:
                    process.env.NODE_ENV === "development"
                        ? errorMessage
                        : undefined,
            },
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
