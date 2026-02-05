import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tutorialTemplates: Record<
    string,
    Array<{
        title: string;
        description: string;
        code?: string;
    }>
> = {
    "fs.readFileSync": [
        {
            title: "fs.readFileSync とは？",
            description:
                "Node.js で標準入力を同期的に読み込むための関数です。競技プログラミングでは最も一般的な入力方法の一つです。",
        },
        {
            title: "基本的な使い方",
            description:
                'fs.readFileSync(0, "utf8") で標準入力を文字列として取得できます。0 は標準入力を表すファイルディスクリプタです。',
            code: `import fs from "fs";

const input = fs.readFileSync(0, "utf8");
console.log(input);`,
        },
        {
            title: "数値への変換",
            description:
                "読み込んだ文字列を数値に変換する場合は、trim() で改行を削除してから parseInt() を使います。",
            code: `import fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const n = parseInt(input, 10);
console.log(n);`,
        },
        {
            title: "複数行の入力",
            description:
                "複数行の入力を扱う場合は、split() を使って行ごとに分割します。",
            code: `import fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const lines = input.split("\\n");
const n = parseInt(lines[0], 10);
const arr = lines[1].split(" ").map(Number);
console.log(n, arr);`,
        },
    ],
    Set: [
        {
            title: "Set とは？",
            description:
                "Set は重複のない値のコレクションを扱うデータ構造です。配列から重複を削除する際に非常に便利です。",
        },
        {
            title: "基本的な使い方",
            description:
                "new Set(配列) で配列から Set を作成できます。重複は自動的に削除されます。",
            code: `const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet.size); // 3`,
        },
        {
            title: "要素の存在チェック",
            description:
                "has() メソッドで要素が存在するか O(1) で確認できます。",
            code: `const set = new Set([1, 2, 3]);
console.log(set.has(2)); // true
console.log(set.has(4)); // false`,
        },
    ],
    Map: [
        {
            title: "Map とは？",
            description:
                "Map はキーと値のペアを保持するデータ構造です。オブジェクトと似ていますが、任意の型をキーにできます。",
        },
        {
            title: "基本的な使い方",
            description:
                "new Map() で作成し、set() で追加、get() で取得します。",
            code: `const map = new Map();
map.set("key1", 10);
map.set("key2", 20);
console.log(map.get("key1")); // 10`,
        },
        {
            title: "デフォルト値の扱い",
            description:
                "Null合体演算子 (??) を使うと、未定義のキーに対してデフォルト値を設定できます。",
            code: `const map = new Map();
const count = (map.get("key") ?? 0) + 1;
map.set("key", count);
console.log(map.get("key")); // 1`,
        },
    ],
    "bit-shift": [
        {
            title: "ビット演算とは？",
            description:
                "ビット演算を使うと、2進数レベルで効率的な計算ができます。特に部分集合の列挙に有用です。",
        },
        {
            title: "左シフト演算子 (<<)",
            description:
                "(1 << n) は 2^n を計算します。N 個の要素から作れる部分集合は 2^N 個です。",
            code: `const n = 3;
const subsetCount = (1 << n); // 2^3 = 8
console.log(subsetCount); // 8`,
        },
        {
            title: "ビットマスクでの判定",
            description:
                "mask & (1 << i) で i 番目のビットが立っているか判定できます。",
            code: `const mask = 5; // 101 in binary
for (let i = 0; i < 3; i++) {
  if (mask & (1 << i)) {
    console.log(\`Bit \${i} is set\`);
  }
}`,
        },
        {
            title: "すべての部分集合の列挙",
            description:
                "0 から 2^n - 1 まで走査することで、すべての部分集合を列挙できます。",
            code: `const n = 3;
const arr = [1, 2, 3];

for (let mask = 0; mask < (1 << n); mask++) {
  const subset = [];
  for (let i = 0; i < n; i++) {
    if (mask & (1 << i)) {
      subset.push(arr[i]);
    }
  }
  console.log(subset);
}`,
        },
    ],
    "binary-search": [
        {
            title: "二分探索とは？",
            description:
                "ソート済み配列から目的の値を O(log N) で見つけるアルゴリズムです。",
        },
        {
            title: "基本形",
            description:
                "while (left < right) で範囲を半分ずつ狭めていきます。",
            code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}`,
        },
    ],
    "prefix-sum": [
        {
            title: "累積和とは？",
            description:
                "配列の各位置までの和を事前計算しておくことで、区間和を O(1) で求められます。",
        },
        {
            title: "累積和の構築",
            description:
                "prefix[i] = prefix[i-1] + arr[i] で累積和配列を作ります。",
            code: `const arr = [1, 2, 3, 4, 5];
const prefix = [0];

for (let i = 0; i < arr.length; i++) {
  prefix.push(prefix[i] + arr[i]);
}

console.log(prefix); // [0, 1, 3, 6, 10, 15]`,
        },
        {
            title: "区間和の計算",
            description:
                "区間 [L, R] の和は prefix[R+1] - prefix[L] で求められます。",
            code: `// 区間 [1, 3] (0-indexed) の和
const L = 1, R = 3;
const sum = prefix[R + 1] - prefix[L];
console.log(sum); // 2 + 3 + 4 = 9`,
        },
    ],
    BFS: [
        {
            title: "BFS (幅優先探索) とは？",
            description:
                "グラフを層ごとに探索するアルゴリズムです。最短経路問題に使えます。",
        },
        {
            title: "キューを使った実装",
            description:
                "queue.shift() で先頭を取り出し、隣接ノードを追加していきます。",
            code: `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}`,
        },
    ],
    DP: [
        {
            title: "DP (動的計画法) とは？",
            description:
                "部分問題の解を保存して再利用することで、計算量を削減する手法です。",
        },
        {
            title: "フィボナッチ数列",
            description: "dp[i] = dp[i-1] + dp[i-2] という遷移式で計算します。",
            code: `function fibonacci(n) {
  const dp = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

console.log(fibonacci(10)); // 55`,
        },
    ],
};
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }, // Promise型に変更
) {
    try {
        // params を await で解決
        const { id: problemId } = await params;

        const problem = await prisma.problem.findUnique({
            where: { id: problemId },
            include: {
                tags: true,
            },
        });

        if (!problem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 },
            );
        }

        // タグに基づいてチュートリアルを選択
        let tutorialSteps = tutorialTemplates["default"] || [];

        for (const tag of problem.tags) {
            if (tutorialTemplates[tag.name]) {
                tutorialSteps = tutorialTemplates[tag.name];
                break;
            }
        }

        // デフォルトのチュートリアル
        if (tutorialSteps.length === 0) {
            tutorialSteps = [
                {
                    title: "この問題について",
                    description: problem.explanation,
                },
                {
                    title: "サンプル入力",
                    description: "まずはサンプル入力を見てみましょう。",
                    code: problem.sampleInput,
                },
                {
                    title: "サンプル出力",
                    description: "このような出力が期待されます。",
                    code: problem.sampleOutput,
                },
            ];
        }

        return NextResponse.json({
            steps: tutorialSteps,
        });
    } catch (error) {
        console.error("Error fetching tutorial:", error);
        return NextResponse.json(
            { error: "Failed to fetch tutorial" },
            { status: 500 },
        );
    }
}
