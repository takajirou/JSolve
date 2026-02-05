export type TutorialStep = {
    title: string;
    description: string;
    code?: string;
};

export type Problem = {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: {
        id: string;
        name: string;
    };
    explanation: string;
    sampleInput: string;
    sampleOutput: string;
    constraints?: string;
    timeLimit: number;
    memoryLimit: number;
    testCases: Array<{
        id: string;
        input: string;
        output: string;
    }>;
    tags: Array<{
        id: string;
        name: string;
        createdAt: string;
    }>;
};
