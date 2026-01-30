export type Problem = {
    id: string;
    functionName: string;
    description: string;
    category: string;
    section?: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    webUsage: "LOW" | "NONE";
    icon: React.ReactNode;
};
