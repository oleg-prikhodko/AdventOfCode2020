import { readLines } from "../utils";

function evaluate(expr: string, calcFn: (expr: string) => number) {
  const re = /\(\d+[^()]+\d+\)/;
  let exprCopy = expr;
  let match = re.exec(exprCopy);
  while (match) {
    exprCopy = exprCopy.replace(
      match[0],
      calcFn(match[0].slice(1, -1)).toString()
    );
    match = re.exec(exprCopy);
  }
  return calcFn(exprCopy);
}

function calculate(expr: string) {
  let result = 0;
  const re = /\d+ [+*] \d+/;

  let exprCopy = expr;
  let match = re.exec(expr);

  while (match) {
    result = eval(match[0]);
    exprCopy = result.toString() + exprCopy.slice(match[0].length);
    match = re.exec(exprCopy);
  }
  return result;
}

function calculateWithPrecedence(expr: string) {
  const re = /\d+ \+ \d+/;
  let exprCopy = expr;
  let match = re.exec(exprCopy);
  while (match) {
    exprCopy = exprCopy.replace(match[0], calculate(match[0]).toString());
    match = re.exec(exprCopy);
  }
  return eval(exprCopy);
}

const input = readLines("/18/input.txt");
const sum = (a: number, b: number) => a + b;

const answer_1 = input.map((expr) => evaluate(expr, calculate)).reduce(sum);
console.log(answer_1);

const answer_2 = input
  .map((expr) => evaluate(expr, calculateWithPrecedence))
  .reduce(sum);
console.log(answer_2);
