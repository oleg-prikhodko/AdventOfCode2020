import { readInputFile } from "../utils";

const groups = readInputFile("/6/input.txt").split("\n\n");

function accumulate(fn: (group: string) => number) {
  return groups.reduce((acc, group) => acc + fn(group), 0);
}

function uniq(group: string) {
  const answers = new Set(group.replace(/\n/g, "").split(""));
  return answers.size;
}

console.log(accumulate(uniq));

function intersect(group: string) {
  const counter: Record<string, number> = {};
  const persons = group.split("\n");
  for (const person of persons) {
    Array.prototype.forEach.call(person, (answer) => {
      if (answer in counter) {
        counter[answer]++;
      } else {
        counter[answer] = 1;
      }
    });
  }
  return Object.values(counter).reduce(
    (acc, count) => (count === persons.length ? acc + 1 : acc),
    0
  );
}

console.log(accumulate(intersect));
