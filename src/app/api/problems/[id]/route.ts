import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;

        const problem = await prisma.problem.findUnique({
            where: { id },
            include: {
                category: true,
                tags: true,
                testCases: true, // ← 追加
            },
        });

        if (!problem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(problem);
    } catch (error) {
        console.error("Error fetching problem:", error);
        return NextResponse.json(
            { error: "Failed to fetch problem" },
            { status: 500 },
        );
    }
}
