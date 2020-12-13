import { readLines } from "../utils";

const lines = readLines("/13/input.txt");
const time = +lines[0];
const buses = lines[1].split(",").map(Number);

function part1() {
  const results: Record<number, number> = {};
  buses
    .filter((bus) => !isNaN(bus))
    .forEach((busId) => {
      let res = 0;
      while (res < time) {
        res += busId;
      }
      results[busId] = res;
    });

  const closest = +Object.keys(results).reduce((acc, busId) => {
    if (results[+busId] < results[+acc]) {
      return busId;
    } else {
      return acc;
    }
  });

  console.log(closest * (results[closest] - time));
}

part1();

// in need of optimization
// ---------------------------
// function part2() {
//   let counter = 0;
//   while (true) {
//     const aligned = buses.every(
//       (bus, index) => isNaN(bus) || (counter + index) % bus === 0
//     );
//     if (aligned) break;
//     counter++;
//   }
//   console.log(counter);
// }
// ---------------------------

// https://rosettacode.org/wiki/Chinese_remainder_theorem#JavaScript
function crt(num: bigint[], rem: bigint[]) {
  let sum = 0n;
  const prod = num.reduce((a, c) => a * c, 1n);

  for (let i = 0; i < num.length; i++) {
    const [ni, ri] = [num[i], rem[i]];
    const p = prod / ni;
    sum += ri * p * mulInv(p, ni);
  }
  return sum % prod;
}

function mulInv(a: bigint, b: bigint) {
  const b0 = b;
  let [x0, x1] = [0n, 1n];

  if (b === 1n) {
    return 1n;
  }
  while (a > 1n) {
    const q = a / b;
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0n) {
    x1 += b0;
  }
  return x1;
}

function part2() {
  const num: bigint[] = [];
  const rem: bigint[] = [];
  for (const [index, bus] of buses.entries()) {
    if (!isNaN(bus)) {
      num.push(BigInt(bus));
      rem.push(BigInt(bus - index));
    }
  }

  console.log(crt(num, rem));
}

part2();
