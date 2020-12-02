import { readLines } from "../utils";

const lines = readLines("/2/input.txt");

function isValid(line: string) {
  const [rule, pass] = line.split(": ");

  const match = /(?<from>\d+)-(?<to>\d+) (?<letter>\w)/.exec(rule)!;
  const from = +match.groups!.from;
  const to = +match.groups!.to;
  const { letter } = match.groups!;

  const count = Array.from(pass).reduce(
    (acc, char) => (char === letter ? acc + 1 : acc),
    0
  );

  return count >= from && count <= to;
}

console.log(lines.filter(isValid).length);

function isValid2(line: string) {
  const [rule, pass] = line.split(": ");

  const match = /(?<pos_1>\d+)-(?<pos_2>\d+) (?<letter>\w)/.exec(rule)!;
  const pos_1 = +match.groups!.pos_1;
  const pos_2 = +match.groups!.pos_2;
  const { letter } = match.groups!;

  const char_1 = pass[pos_1 - 1];
  const char_2 = pass[pos_2 - 1];

  return (
    (char_1 === letter && char_2 !== letter) ||
    (char_1 !== letter && char_2 === letter)
  );
}

console.log(lines.filter(isValid2).length);
