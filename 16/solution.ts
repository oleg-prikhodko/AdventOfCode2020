import { readInputFile } from "../utils";

const [r, m, o] = readInputFile("/16/input.txt").split("\n\n");

function parseRule(rule: string) {
  const match = /.+: (\d+)-(\d+) or (\d+)-(\d+)/.exec(rule);
  return match!.slice(1).map(Number);
}

const rules = r.split("\n").map(parseRule);
const [, myTicket] = m.split("\n");
const otherTickets = o.split("\n").slice(1);

function isValidForRule(rule: number[], value: number) {
  const [a1, a2, b1, b2] = rule;
  return (value >= a1 && value <= a2) || (value >= b1 && value <= b2);
}

function findInvalid(ticket: string) {
  const invalidValues: number[] = [];
  for (const value of ticket.split(",").map(Number)) {
    const isValid = rules.some((rule) => isValidForRule(rule, value));
    if (!isValid) {
      invalidValues.push(value);
    }
  }
  return invalidValues;
}

const invalidValues = otherTickets.map(findInvalid).flat();
console.log(invalidValues.reduce((acc, num) => acc + num));

// ----------------------

const validTickets = otherTickets
  .filter((ticket) => findInvalid(ticket).length === 0)
  .map((ticket) => ticket.split(",").map(Number));
const indexesTotal = myTicket.split(",").length;

const rulesByTicketValues: Set<number>[] = [];

for (let i = 0; i < indexesTotal; i++) {
  const valuesFromTickets = validTickets.map((ticket) => ticket[i]);
  const acceptableRules: number[] = [];
  rules.forEach((rule, ruleIndex) => {
    const acceptable = valuesFromTickets.every((value) =>
      isValidForRule(rule, value)
    );
    if (acceptable) acceptableRules.push(ruleIndex);
  });

  rulesByTicketValues[i] = new Set(acceptableRules);
}

// ----------------------

const results: number[] = [];

while (true) {
  const hasOneRuleIndex = rulesByTicketValues.findIndex(
    (rules) => rules.size === 1
  );
  if (hasOneRuleIndex < 0) break;
  const hasOneRule = rulesByTicketValues[hasOneRuleIndex];
  const duplicate = [...hasOneRule.entries()][0][0];
  results[duplicate] = hasOneRuleIndex;
  rulesByTicketValues.forEach((rule) => rule.delete(duplicate));
}

// ----------------------

const indexesToMultiply = results.slice(0, 6);
const myTicketValues = myTicket.split(",").map(Number);

const answer = myTicketValues.reduce((acc, val, idx) => {
  return indexesToMultiply.includes(idx) ? acc * val : acc;
}, 1);

console.log(answer);
