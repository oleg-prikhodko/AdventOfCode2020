import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function readInputFile(inputFileName: string) {
  const fullPath = join(__dirname, inputFileName);
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, "utf8").trim();
  } else {
    throw new Error("File do not exist");
  }
}

export function readLines(inputFileName: string) {
  return readInputFile(inputFileName).split("\n");
}

export function* range(start: number, limit: number) {
  let count = start;
  while (count !== limit) {
    yield count < limit ? count++ : count--;
  }
  yield count;
}
