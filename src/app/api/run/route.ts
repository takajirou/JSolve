import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

type RunRequest = {
    code: string;
    input: string;
};

export async function POST(req: Request) {
    const { code, input }: RunRequest = await req.json();

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "runner-"));
    const filePath = path.join(tmpDir, "main.ts");

    await fs.writeFile(filePath, code, "utf8");

    return new Promise<Response>((resolve) => {
        const proc = spawn("npx", ["tsx", filePath], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", (d) => (stdout += d.toString()));
        proc.stderr.on("data", (d) => (stderr += d.toString()));

        proc.stdin.write(input);
        proc.stdin.end();

        const timer = setTimeout(() => {
            proc.kill("SIGKILL");
            resolve(
                NextResponse.json({
                    result: "TIME_LIMIT_EXCEEDED",
                }),
            );
        }, 2000);

        proc.on("close", async () => {
            clearTimeout(timer);
            await fs.rm(tmpDir, { recursive: true, force: true });

            resolve(
                NextResponse.json({
                    stdout,
                    stderr,
                }),
            );
        });
    });
}
