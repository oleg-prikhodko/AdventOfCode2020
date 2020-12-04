import { readInputFile } from "../utils";

const passports = readInputFile("/4/input.txt")
  .split("\n\n")
  .map(parsePassport);

function parsePassport(info: string) {
  return Object.fromEntries(info.split(/\s/).map((line) => line.split(":")));
}

type Passport = Record<string, string | undefined>;

type Validator = (passport: Passport) => boolean;

function validPassports(rules: Validator[]) {
  const isValid = (pass: Passport) => rules.every((validate) => validate(pass));
  return passports.filter(isValid).length;
}

const rules_1: Validator[] = [
  (pass) => "byr" in pass,
  (pass) => "iyr" in pass,
  (pass) => "eyr" in pass,
  (pass) => "hgt" in pass,
  (pass) => "hcl" in pass,
  (pass) => "ecl" in pass,
  (pass) => "pid" in pass,
];

console.log(validPassports(rules_1));

const eyeColors = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

const rules_2: Validator[] = [
  (pass) =>
    pass.byr !== undefined &&
    /^\d{4}$/.test(pass.byr) &&
    parseInt(pass.byr) >= 1920 &&
    parseInt(pass.byr) <= 2002,
  (pass) =>
    pass.iyr !== undefined &&
    /^\d{4}$/.test(pass.iyr) &&
    parseInt(pass.iyr) >= 2010 &&
    parseInt(pass.iyr) <= 2020,
  (pass) =>
    pass.eyr !== undefined &&
    /^\d{4}$/.test(pass.eyr) &&
    parseInt(pass.eyr) >= 2020 &&
    parseInt(pass.eyr) <= 2030,
  (pass) => {
    if (!pass.hgt) return false;

    const regexp = /^(?<height>\d+)(?<units>cm|in)$/;
    const match = regexp.exec(pass.hgt);
    if (!match || !match.groups) return false;

    const height = parseInt(match.groups.height);
    return match.groups.units === "cm"
      ? height >= 150 && height <= 193
      : height >= 59 && height <= 76;
  },
  (pass) => pass.hcl !== undefined && /^#[0-9a-f]{6}$/.test(pass.hcl),
  (pass) => pass.ecl !== undefined && eyeColors.has(pass.ecl),
  (pass) => pass.pid !== undefined && /^\d{9}$/.test(pass.pid),
];

console.log(validPassports(rules_2));
