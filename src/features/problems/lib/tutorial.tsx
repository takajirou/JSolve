import fs from "fs";
import path from "path";

export interface TutorialStep {
    order: number;
    title: string;
    description: string;
    code?: string | null;
}

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    steps: TutorialStep[];
}

/**
 * functionNameからチュートリアルIDを生成
 * 例: "fs.readFileSync" → "fs-readfilesync"
 */
export function generateTutorialId(functionName: string): string {
    return functionName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[().]/g, "")
        .replace(/\//g, "-");
}

/**
 * 公式チュートリアルをJSONファイルから取得
 */
export function getOfficialTutorial(tutorialId: string): Tutorial | null {
    try {
        const filePath = path.join(
            process.cwd(),
            "src/data/tutorials",
            `${tutorialId}.json`,
        );

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Failed to load tutorial: ${tutorialId}`, error);
        return null;
    }
}

/**
 * カスタムチュートリアルをパース
 */
export function parseCustomTutorial(
    customTutorialJson: string,
): Tutorial | null {
    try {
        return JSON.parse(customTutorialJson);
    } catch (error) {
        console.error("Failed to parse custom tutorial", error);
        return null;
    }
}

/**
 * チュートリアルを取得（公式 or カスタム）
 */
export function getTutorial(
    functionName: string,
    customTutorialJson: string | null,
    isOfficial: boolean,
): Tutorial | null {
    // ユーザー作成問題の場合、customTutorialから取得
    if (!isOfficial && customTutorialJson) {
        return parseCustomTutorial(customTutorialJson);
    }

    // 公式問題の場合、JSONファイルから取得
    const tutorialId = generateTutorialId(functionName);
    return getOfficialTutorial(tutorialId);
}

// キャッシュ（本番環境向け）
const tutorialCache = new Map<string, Tutorial>();

/**
 * キャッシュ付きでチュートリアルを取得
 */
export function getTutorialCached(
    functionName: string,
    customTutorialJson: string | null,
    isOfficial: boolean,
): Tutorial | null {
    // カスタムチュートリアルはキャッシュしない
    if (!isOfficial && customTutorialJson) {
        return parseCustomTutorial(customTutorialJson);
    }

    const tutorialId = generateTutorialId(functionName);

    if (tutorialCache.has(tutorialId)) {
        return tutorialCache.get(tutorialId)!;
    }

    const tutorial = getOfficialTutorial(tutorialId);
    if (tutorial) {
        tutorialCache.set(tutorialId, tutorial);
    }

    return tutorial;
}

/**
 * デフォルトチュートリアルを生成
 */
export function generateDefaultTutorial(
    title: string,
    explanation: string,
    sampleInput: string,
    sampleOutput: string,
): Tutorial {
    return {
        id: "default",
        title: `${title} - チュートリアル`,
        description: "この問題の基本的な説明です",
        steps: [
            {
                order: 1,
                title: "問題の説明",
                description: explanation,
            },
            {
                order: 2,
                title: "サンプル入力",
                description: "まずはサンプル入力を見てみましょう。",
                code: sampleInput,
            },
            {
                order: 3,
                title: "サンプル出力",
                description: "このような出力が期待されます。",
                code: sampleOutput,
            },
        ],
    };
}

/**
 * チュートリアルをJSON文字列に変換
 */
export function serializeTutorial(tutorial: Tutorial): string {
    return JSON.stringify(tutorial);
}
