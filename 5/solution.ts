import { deepStrictEqual } from "assert";
import { readLines } from "../utils";

function find(line: string, lower: number, upper: number, lowerChar: string) {
  for (const indicator of line) {
    const range = upper - lower + 1;
    if (indicator === lowerChar) {
      if (range === 2) return lower;
      upper -= range / 2;
    } else {
      if (range === 2) return upper;
      lower += range / 2;
    }
  }
}

function getSeatId(row: number, col: number) {
  return row * 8 + col;
}

function passInfo(pass: string) {
  const row = find(pass.slice(0, 7), 0, 127, "F");
  const col = find(pass.slice(-3), 0, 7, "L");
  const seatId = getSeatId(row!, col!);
  return [row, col, seatId];
}

deepStrictEqual(passInfo("BFFFBBFRRR"), [70, 7, 567]);
deepStrictEqual(passInfo("FFFBBBFRRR"), [14, 7, 119]);
deepStrictEqual(passInfo("BBFFBBFRLL"), [102, 4, 820]);

const seats = readLines("/5/input.txt")
  .map(passInfo)
  .map(([, , seat]) => seat!)
  .sort((a, b) => b - a);

console.log(seats[0]);

function findYours() {
  for (const [index, seat] of seats.entries()) {
    if (index === 0) continue;
    const prevSeat = seats[index - 1];
    // descending order
    if (prevSeat !== seat + 1) {
      return [prevSeat, seat];
    }
  }
}

console.log(findYours());
