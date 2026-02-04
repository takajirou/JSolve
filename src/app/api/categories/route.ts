import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: {
                        problems: true,
                    },
                },
            },
        });

        return NextResponse.json({
            categories: categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                displayName: cat.displayName,
                description: cat.description,
                problemCount: cat._count.problems,
            })),
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 },
        );
    }
}
