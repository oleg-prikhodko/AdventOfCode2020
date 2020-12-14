import { readLines } from "../utils";

const lines = readLines("/14/input.txt");
let mask = "X".repeat(36);
const mem_1: Record<string, number> = {};
const mem_2: Record<string, number> = {};

const reMask = /mask = (?<mask>\w+)/;
const reMem = /mem\[(?<addr>\d+)\] = (?<value>\d+)/;
lines.forEach((line) => {
  let match = reMask.exec(line);
  if (match) {
    mask = match.groups!.mask;
  } else {
    const { addr, value } = reMem.exec(line)!.groups!;

    // part 1 -----------------------------
    const valueBinary = parseInt(value).toString(2).padStart(36, "0");
    const valueArr = valueBinary.split("");
    for (const [index, val] of Array.prototype.entries.call(mask)) {
      if (val !== "X") {
        valueArr[index] = val;
      }
    }
    mem_1[addr] = parseInt(valueArr.join(""), 2);

    // part 2 -----------------------------
    const addrBinary = parseInt(addr).toString(2).padStart(36, "0");
    const addrArr = addrBinary.split("");
    for (const [index, val] of Array.prototype.entries.call(mask)) {
      if (val === "1" || val === "X") {
        addrArr[index] = val;
      }
    }
    const perms = permutations(addrArr);
    perms.forEach((addr) => {
      mem_2[addr] = +value;
    });
  }
});

const sum = (a: number, b: number) => a + b;
console.log(Object.values(mem_1).reduce(sum));
console.log(Object.values(mem_2).reduce(sum));

function permutations(memMask: string[]) {
  const floatingIndexes = memMask.reduce<number[]>((acc, char, idx) => {
    if (char === "X") {
      acc.push(idx);
    }
    return acc;
  }, []);
  if (!floatingIndexes.length) {
    return [memMask.join("")];
  }
  const permutations: Set<string> = new Set();
  let index = floatingIndexes.shift();

  const addPermutations = (maskArr: string[], index: number) => {
    const a = maskArr.slice();
    a[index] = "0";
    const b = maskArr.slice();
    b[index] = "1";
    permutations.add(a.join("").replace(/X/g, "0"));
    permutations.add(a.join("").replace(/X/g, "1"));
    permutations.add(b.join("").replace(/X/g, "0"));
    permutations.add(b.join("").replace(/X/g, "1"));
  };

  while (index !== undefined) {
    if (permutations.size) {
      for (const perm of permutations.values()) {
        addPermutations(perm.split(""), index);
      }
    } else {
      addPermutations(memMask, index);
    }
    index = floatingIndexes.shift();
  }
  return [...permutations];
}
