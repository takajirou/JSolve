import { NextResponse } from "next/server";
import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [totalCount, easyCount, mediumCount, hardCount] =
            await Promise.all([
                prisma.problem.count(),
                prisma.problem.count({
                    where: { difficulty: DifficultyLevel.EASY },
                }),
                prisma.problem.count({
                    where: { difficulty: DifficultyLevel.MEDIUM },
                }),
                prisma.problem.count({
                    where: { difficulty: DifficultyLevel.HARD },
                }),
            ]);

        return NextResponse.json({
            total: totalCount,
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 },
        );
    }
}
