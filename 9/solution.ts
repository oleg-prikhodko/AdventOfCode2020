import { readLines } from "../utils";

const nums = readLines("/9/input.txt").map(Number);

function findTerms(prev: number[], current: number) {
  for (const [index, a] of prev.entries()) {
    const rest = prev.slice();
    rest.splice(index, 1);
    for (const b of rest) {
      if (a + b === current) {
        return [a, b];
      }
    }
  }
}

function findOutlier(len = 25) {
  let counter = 0;
  while (counter <= nums.length - len - 1) {
    const prev = nums.slice(counter, counter + len + 1);
    const current = prev.pop()!;

    const res = findTerms(prev, current);
    if (!res) {
      return current;
    }
    counter++;
  }
}

const outlier = findOutlier()!;
console.log(outlier);

function findRange() {
  let lower = 0;
  while (lower <= nums.length - 2) {
    let upper = lower + 1;
    let sum = nums[lower];
    while (true) {
      sum += nums[upper];
      if (sum === outlier) {
        return [lower, upper];
      } else if (sum > outlier) {
        break;
      } else {
        upper++;
      }
    }
    lower++;
  }
}

const [from, to] = findRange()!;
const range = nums.slice(from, to + 1);
console.log(Math.min(...range) + Math.max(...range));
