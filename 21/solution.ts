import { Counter, readLines } from "../utils";

function parse() {
  const foobByAllergen: Record<string, Set<string>> = {};
  const ingredientsCounter = new Counter<string>();

  readLines("/21/input.txt").forEach((line) => {
    const {
      food,
      allergens,
    } = /(?<food>.+) \(contains (?<allergens>.+)\)/.exec(line)!.groups!;

    const foodList = food.split(" ");
    foodList.forEach((f) => ingredientsCounter.add(f));

    for (const allergen of allergens.split(", ")) {
      const foodSet = new Set(foodList);
      if (foobByAllergen[allergen]) {
        for (const f of foobByAllergen[allergen].values()) {
          if (!foodSet.has(f)) {
            foobByAllergen[allergen].delete(f);
          }
        }
      } else {
        foobByAllergen[allergen] = foodSet;
      }
    }
  });

  return { foobByAllergen, ingredientsCounter };
}

const { foobByAllergen, ingredientsCounter } = parse();
const entries = Object.entries(foobByAllergen);
const allergenByIngredient: Record<string, string> = {};

while (entries.length) {
  const entryIndex = entries.findIndex(([, set]) => set.size === 1);
  if (entryIndex >= 0) {
    const [[allergen, foodSet]] = entries.splice(entryIndex, 1);
    const ingredient = foodSet.values().next().value as string;
    allergenByIngredient[ingredient] = allergen;
    for (const [, set] of entries) {
      set.delete(ingredient);
    }
  }
}

const withoutAllergens = Object.keys(ingredientsCounter.results).filter(
  (ingredient) => !allergenByIngredient[ingredient]
);
const timesAppear = withoutAllergens.reduce((acc, ingredient) => {
  return acc + ingredientsCounter.getCount(ingredient);
}, 0);
console.log(timesAppear);

const ingredientByAllergen = Object.fromEntries(
  Object.entries(allergenByIngredient).map(([key, value]) => [value, key])
);
const canonicalList = Object.values(allergenByIngredient)
  .sort()
  .map((allergen) => ingredientByAllergen[allergen])
  .join(",");
console.log(canonicalList);
