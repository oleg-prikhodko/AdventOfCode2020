import { readLines } from "../utils";

class Counter {
  counts: Record<number, number>;
  constructor() {
    this.counts = {};
  }
  add(num: number) {
    if (this.counts[num]) {
      this.counts[num]++;
    } else {
      this.counts[num] = 1;
    }
  }
}

const counter = new Counter();
const adapters = readLines("/10/input.txt")
  .map(Number)
  .sort((a, b) => a - b);
adapters.unshift(0);
adapters.push(adapters[adapters.length - 1] + 3);

for (const [index, current] of adapters.entries()) {
  const next = adapters[index + 1];
  if (next) {
    counter.add(next - current);
  }
}

console.log(counter.counts[1] * counter.counts[3]);

const cache: Record<number, number> = {};

function tr(list: number[], current: number) {
  if (current in cache) return cache[current];
  else if (!list.length) return 1;

  let arrangements = 0;
  const rest = list.slice();
  let num = current;

  while (rest.length) {
    num = rest.shift()!;
    if (num - current <= 3) {
      const result = tr(rest, num);
      cache[num] = result;
      arrangements += result;
    }
  }

  return arrangements;
}

console.log(tr(adapters, adapters.shift()!));
