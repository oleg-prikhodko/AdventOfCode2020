import { readLines } from "../utils";

const colorRe = /^(?<color>\w+ \w+) bags contain/;
const containsRe = /(?<count>\d+) (?<color>\w+ \w+)/g;

const rules = readLines("/7/input.txt");
const entries = rules.map((rule) => {
  const color = colorRe.exec(rule)?.groups?.color!;
  const contained = Array.from(rule.matchAll(containsRe), (match) => ({
    ...match.groups,
    count: +match.groups?.count!,
  }));
  return [color, contained];
});
const colorsMap: Record<
  string,
  { color: string; count: number }[]
> = Object.fromEntries(entries);

function find(color: string) {
  const colorsToSearch = Object.entries(colorsMap).reduce<string[]>(
    (acc, entry) => {
      if (entry[0] !== color && entry[1].length) {
        acc.push(entry[0]);
      }
      return acc;
    },
    []
  );

  return colorsToSearch.filter((source) => containsBag(source, color));
}

function containsBag(sourceBag: string, containedColor: string): boolean {
  if (colorsMap[sourceBag].some(({ color }) => color === containedColor)) {
    return true;
  } else if (!colorsMap[sourceBag].length) {
    return false;
  } else {
    return colorsMap[sourceBag].some(({ color }) =>
      containsBag(color, containedColor)
    );
  }
}

console.log(find("shiny gold").length);

function count(color: string): number {
  if (!colorsMap[color].length) {
    return 0;
  } else {
    return colorsMap[color].reduce((acc, bag) => {
      return acc + bag.count + bag.count * count(bag.color);
    }, 0);
  }
}

console.log(count("shiny gold"));
