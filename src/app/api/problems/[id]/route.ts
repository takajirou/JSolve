import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const problemId = params.id;

        const problem = await prisma.problem.findUnique({
            where: { id: problemId },
            include: {
                category: true,
                tags: true,
                testCases: {
                    where: { isHidden: false },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!problem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            id: problem.id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            category: problem.category.displayName,
            explanation: problem.explanation,
            sampleInput: problem.sampleInput,
            sampleOutput: problem.sampleOutput,
            constraints: problem.constraints,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
            testCases: problem.testCases.map((tc) => ({
                id: tc.id,
                input: tc.input,
                output: tc.output,
            })),
            tags: problem.tags.map((t) => t.name),
        });
    } catch (error) {
        console.error("Error fetching problem:", error);
        return NextResponse.json(
            { error: "Failed to fetch problem" },
            { status: 500 },
        );
    }
}
