import { readInputFile } from "../utils";

const [rs, msgs] = readInputFile("/19/input.txt").split("\n\n");

const rules = rs.split("\n").reduce<Record<number, string>>((acc, line) => {
  const [key, rest] = line.split(": ");
  acc[+key] = rest;
  return acc;
}, {});

const messages = msgs.split("\n");

function go(line: string): string | Set<string> {
  if (/"/.test(line)) {
    return line.replace(/"/g, "");
  } else if (/\|/.test(line)) {
    const variants = new Set<string>();

    for (const substr of line.split(" | ")) {
      const result = go(substr);
      if (typeof result === "string") {
        variants.add(result);
      } else {
        result.forEach((res) => variants.add(res));
      }
    }

    return variants;
  } else {
    let variants = new Set<string>();

    for (const key of line.split(" ")) {
      const rule = rules[+key];
      const result = go(rule);

      if (typeof result === "string") {
        if (variants.size === 0) {
          variants.add(result);
        } else {
          variants = new Set(
            Array.from(variants.values(), (value) => value + result)
          );
        }
      } else {
        if (variants.size === 0) {
          variants = result;
        } else {
          variants = new Set(
            Array.from(variants.values(), (prev) =>
              Array.from(result.values(), (next) => prev + next)
            ).flat()
          );
        }
      }
    }

    return variants;
  }
}

const valid = go(rules[0]) as Set<string>;
console.log(messages.filter((message) => valid.has(message)).length);
