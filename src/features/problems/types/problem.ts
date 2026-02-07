export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    functionKeys: string[];
    hasTutorial: boolean;
}

export interface FunctionCategory {
    key: string;
    displayName: string;
}
