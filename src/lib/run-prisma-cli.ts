import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const maxBuffer = 20 * 1024 * 1024;

export async function runPrismaMigrateDeploy(cwd: string) {
  return execFileAsync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], {
    cwd,
    env: process.env,
    maxBuffer,
  });
}

export async function runPrismaSeed(cwd: string) {
  return execFileAsync(process.execPath, ["prisma/seed.cjs"], {
    cwd,
    env: process.env,
    maxBuffer,
  });
}

export function trimCliLog(text: string, max = 12_000) {
  if (text.length <= max) return text;
  return `…(truncated)\n${text.slice(-max)}`;
}
