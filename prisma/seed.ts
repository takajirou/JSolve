import { PrismaClient, DifficultyLevel, WebUsageLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 データベースのシード開始...");

    // ========================================
    // 1. カテゴリーの作成
    // ========================================
    console.log("📁 カテゴリーを作成中...");

    const ioCategory = await prisma.category.create({
        data: {
            name: "io",
            displayName: "入出力",
            description: "標準入力・標準出力の基本処理",
            order: 1,
        },
    });

    const setMapCategory = await prisma.category.create({
        data: {
            name: "set-map",
            displayName: "Set / Map",
            description: "Set と Map を使ったデータ構造の操作",
            order: 2,
        },
    });

    const mathCategory = await prisma.category.create({
        data: {
            name: "math",
            displayName: "数値 / Math",
            description: "数値計算と Math オブジェクトの活用",
            order: 3,
        },
    });

    const stringCategory = await prisma.category.create({
        data: {
            name: "string",
            displayName: "文字列",
            description: "文字列操作と変換処理",
            order: 4,
        },
    });

    const sortCategory = await prisma.category.create({
        data: {
            name: "sort",
            displayName: "ソート",
            description: "配列のソート処理",
            order: 5,
        },
    });

    const loopCategory = await prisma.category.create({
        data: {
            name: "loop",
            displayName: "ループ",
            description: "for文とループ制御",
            order: 6,
        },
    });

    const algorithmCategory = await prisma.category.create({
        data: {
            name: "algorithm",
            displayName: "アルゴリズム",
            description: "基本的なアルゴリズムの実装",
            order: 7,
        },
    });

    const bitCategory = await prisma.category.create({
        data: {
            name: "bit",
            displayName: "ビット演算",
            description: "ビット演算を使った高速な処理",
            order: 8,
        },
    });

    const arrayCategory = await prisma.category.create({
        data: {
            name: "array",
            displayName: "配列操作",
            description: "配列の操作と累積和",
            order: 9,
        },
    });

    const graphCategory = await prisma.category.create({
        data: {
            name: "graph",
            displayName: "グラフ",
            description: "グラフ探索アルゴリズム",
            order: 10,
        },
    });

    const dpCategory = await prisma.category.create({
        data: {
            name: "dp",
            displayName: "DP",
            description: "動的計画法",
            order: 11,
        },
    });

    console.log(`✅ ${11}個のカテゴリーを作成しました`);

    // ========================================
    // 2. タグの作成
    // ========================================
    console.log("🏷️  タグを作成中...");

    await Promise.all([
        prisma.tag.create({ data: { name: "fs.readFileSync" } }),
        prisma.tag.create({ data: { name: "process.stdin" } }),
        prisma.tag.create({ data: { name: "Set" } }),
        prisma.tag.create({ data: { name: "Map" } }),
        prisma.tag.create({ data: { name: "Math.min" } }),
        prisma.tag.create({ data: { name: "Math.max" } }),
        prisma.tag.create({ data: { name: "charCodeAt" } }),
        prisma.tag.create({ data: { name: "parseInt" } }),
        prisma.tag.create({ data: { name: "sort" } }),
        prisma.tag.create({ data: { name: "for-loop" } }),
        prisma.tag.create({ data: { name: "bit-shift" } }),
        prisma.tag.create({ data: { name: "binary-search" } }),
        prisma.tag.create({ data: { name: "prefix-sum" } }),
        prisma.tag.create({ data: { name: "BFS" } }),
        prisma.tag.create({ data: { name: "DFS" } }),
        prisma.tag.create({ data: { name: "DP" } }),
    ]);

    console.log("✅ 16個のタグを作成しました");

    // ========================================
    // 3. 問題の作成
    // ========================================
    console.log("📝 問題を作成中...");

    // -------------------------------------
    // 問題1: fs.readFileSyncの基本
    // -------------------------------------
    const problem1 = await prisma.problem.create({
        data: {
            title: "標準入力を受け取って出力せよ",
            description:
                "整数 N が 1 行で与えられます。N をそのまま出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: ioCategory.id,
            functionName: "fs.readFileSync",
            webUsage: WebUsageLevel.NONE,
            explanation: `fs.readFileSync(0, 'utf8') を使うことで、標準入力全体を文字列として読み込めます。
0 は標準入力を表すファイルディスクリプタです。
trim() を使って末尾の改行を削除し、必要に応じて parseInt で数値に変換します。`,
            sampleInput: "5",
            sampleOutput: "5",
            constraints: "1 ≤ N ≤ 10^9",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "fs.readFileSync" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem1.id,
                input: "5",
                output: "5",
                isHidden: false,
                order: 1,
            },
            {
                problemId: problem1.id,
                input: "100",
                output: "100",
                isHidden: false,
                order: 2,
            },
            {
                problemId: problem1.id,
                input: "1000000000",
                output: "1000000000",
                isHidden: true,
                order: 3,
            },
        ],
    });

    // -------------------------------------
    // 問題2: process.stdinの基本
    // -------------------------------------
    const problem2 = await prisma.problem.create({
        data: {
            title: "ストリームで標準入力を受け取れ",
            description:
                "複数行の整数が与えられます。各行をそのまま出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: ioCategory.id,
            functionName: "process.stdin",
            webUsage: WebUsageLevel.NONE,
            explanation: `process.stdin.on('data') を使うことで、ストリームとして標準入力を扱えます。
大量のデータを扱う場合に有効です。`,
            sampleInput: "1\n2\n3",
            sampleOutput: "1\n2\n3",
            constraints: "1 ≤ 各整数 ≤ 100",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "process.stdin" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem2.id,
                input: "1\n2\n3",
                output: "1\n2\n3",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題3: Setの基本
    // -------------------------------------
    const problem3 = await prisma.problem.create({
        data: {
            title: "配列から重複を削除せよ",
            description:
                "N 個の整数が与えられます。重複を削除した個数を出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: setMapCategory.id,
            functionName: "Set",
            webUsage: WebUsageLevel.NONE,
            explanation: `new Set() を使うことで、重複を自動的に削除できます。
配列から Set を作成し、.size で要素数を取得します。`,
            sampleInput: "5\n1 2 2 3 3",
            sampleOutput: "3",
            constraints: "1 ≤ N ≤ 10^5",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "Set" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem3.id,
                input: "5\n1 2 2 3 3",
                output: "3",
                isHidden: false,
                order: 1,
            },
            {
                problemId: problem3.id,
                input: "3\n1 1 1",
                output: "1",
                isHidden: false,
                order: 2,
            },
        ],
    });

    // -------------------------------------
    // 問題4: Mapの基本
    // -------------------------------------
    const problem4 = await prisma.problem.create({
        data: {
            title: "各要素の出現回数を数えよ",
            description:
                "N 個の整数が与えられます。最も多く出現する整数の出現回数を出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: setMapCategory.id,
            functionName: "Map",
            webUsage: WebUsageLevel.NONE,
            explanation: `Map を使って各要素の出現回数を記録します。
map.get(key) ?? 0 で、未定義の場合は 0 を返すことができます。`,
            sampleInput: "5\n1 2 2 3 3",
            sampleOutput: "2",
            constraints: "1 ≤ N ≤ 10^5",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "Map" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem4.id,
                input: "5\n1 2 2 3 3",
                output: "2",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題5: Math.minの基本
    // -------------------------------------
    const problem5 = await prisma.problem.create({
        data: {
            title: "配列の最小値を求めよ",
            description: "N 個の整数が与えられます。最小値を出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: mathCategory.id,
            functionName: "Math.min",
            webUsage: WebUsageLevel.NONE,
            explanation: `Math.min() をスプレッド構文で使うと、大きな配列でスタックオーバーフローする可能性があります。
for ループで最小値を更新する方が安全です。`,
            sampleInput: "3\n5 2 8",
            sampleOutput: "2",
            constraints: "1 ≤ N ≤ 10^5",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "Math.min" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem5.id,
                input: "3\n5 2 8",
                output: "2",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題6: ビット全探索
    // -------------------------------------
    const problem6 = await prisma.problem.create({
        data: {
            title: "すべての部分集合の和を求めよ",
            description:
                "N 個の整数が与えられます。すべての部分集合の和の総和を出力してください。",
            difficulty: DifficultyLevel.MEDIUM,
            categoryId: bitCategory.id,
            functionName: "ビット演算",
            webUsage: WebUsageLevel.NONE,
            explanation: `ビット全探索を使って、すべての部分集合を列挙します。
(1 << n) で 2^n を計算し、mask & (1 << i) で i 番目の要素が含まれるか判定します。`,
            sampleInput: "3\n1 2 3",
            sampleOutput: "24",
            constraints: "1 ≤ N ≤ 20",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "bit-shift" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem6.id,
                input: "3\n1 2 3",
                output: "24",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題7: 二分探索
    // -------------------------------------
    const problem7 = await prisma.problem.create({
        data: {
            title: "ソート済み配列から値を探せ",
            description:
                "N 個のソート済み整数と、クエリ Q が与えられます。Q が配列に含まれるか判定してください。",
            difficulty: DifficultyLevel.MEDIUM,
            categoryId: algorithmCategory.id,
            functionName: "二分探索",
            webUsage: WebUsageLevel.NONE,
            explanation: `二分探索を使って、O(log N) で値を検索します。
while (left < right) のループで、中央値を比較しながら範囲を狭めます。`,
            sampleInput: "5 3\n1 2 4 7 9",
            sampleOutput: "NO",
            constraints: "1 ≤ N ≤ 10^5",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "binary-search" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem7.id,
                input: "5 3\n1 2 4 7 9",
                output: "NO",
                isHidden: false,
                order: 1,
            },
            {
                problemId: problem7.id,
                input: "5 7\n1 2 4 7 9",
                output: "YES",
                isHidden: false,
                order: 2,
            },
        ],
    });

    // -------------------------------------
    // 問題8: 累積和
    // -------------------------------------
    const problem8 = await prisma.problem.create({
        data: {
            title: "区間和クエリに答えよ",
            description:
                "N 個の整数と Q 個のクエリが与えられます。各クエリ [L, R] に対して区間和を出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: arrayCategory.id,
            functionName: "累積和",
            webUsage: WebUsageLevel.NONE,
            explanation: `累積和を事前に計算しておくことで、各クエリを O(1) で処理できます。
prefix[i] = prefix[i-1] + a[i] で累積和を構築します。`,
            sampleInput: "5 2\n1 2 3 4 5\n1 3\n2 5",
            sampleOutput: "6\n14",
            constraints: "1 ≤ N, Q ≤ 10^5",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "prefix-sum" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem8.id,
                input: "5 2\n1 2 3 4 5\n1 3\n2 5",
                output: "6\n14",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題9: BFS（幅優先探索）
    // -------------------------------------
    const problem9 = await prisma.problem.create({
        data: {
            title: "迷路の最短経路を求めよ",
            description:
                "H×W のグリッドが与えられます。S から G までの最短距離を出力してください。",
            difficulty: DifficultyLevel.EASY,
            categoryId: graphCategory.id,
            functionName: "BFS",
            webUsage: WebUsageLevel.NONE,
            explanation: `幅優先探索(BFS)を使って、最短経路を求めます。
queue.shift() でキューから要素を取り出し、隣接セルを探索します。`,
            sampleInput: "3 3\nS..\n.#.\n..G",
            sampleOutput: "4",
            constraints: "1 ≤ H, W ≤ 100",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "BFS" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem9.id,
                input: "3 3\nS..\n.#.\n..G",
                output: "4",
                isHidden: false,
                order: 1,
            },
        ],
    });

    // -------------------------------------
    // 問題10: 動的計画法
    // -------------------------------------
    const problem10 = await prisma.problem.create({
        data: {
            title: "フィボナッチ数列の N 項目を求めよ",
            description:
                "整数 N が与えられます。フィボナッチ数列の N 項目を出力してください。",
            difficulty: DifficultyLevel.MEDIUM,
            categoryId: dpCategory.id,
            functionName: "DP",
            webUsage: WebUsageLevel.NONE,
            explanation: `動的計画法を使って、フィボナッチ数列を効率的に計算します。
dp[i] = dp[i-1] + dp[i-2] の遷移式で求めます。`,
            sampleInput: "10",
            sampleOutput: "55",
            constraints: "1 ≤ N ≤ 90",
            timeLimit: 2000,
            memoryLimit: 256,
            tags: {
                connect: [{ name: "DP" }],
            },
        },
    });

    await prisma.testCase.createMany({
        data: [
            {
                problemId: problem10.id,
                input: "10",
                output: "55",
                isHidden: false,
                order: 1,
            },
            {
                problemId: problem10.id,
                input: "1",
                output: "1",
                isHidden: false,
                order: 2,
            },
        ],
    });

    console.log("✅ 10個の問題とテストケースを作成しました");

    console.log("\n🎉 シード完了!");
    console.log("📊 作成したデータ:");
    console.log(`   - カテゴリー: 11個`);
    console.log(`   - タグ: 16個`);
    console.log(`   - 問題: 10個`);
}

main()
    .catch((e) => {
        console.error("❌ エラーが発生しました:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
