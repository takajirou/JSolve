export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    functionKeys: string[];
    hasTutorial: boolean;
    requiredFunctions: string[];
}

export interface FunctionCategory {
    key: string;
    displayName: string;
}

export type TutorialDialogItem =
    | { type: "text"; value: string }
    | { type: "code"; language: "ts"; value: string };

export type StaticTutorial = {
    staticKey: string;
    functionKey: string;
    dialog: TutorialDialogItem[];
};

export type TestCase = {
    input: string;
    output: string;
};

export type StaticTestCases = {
    staticKey: string;
    cases: TestCase[];
};
