import { readLines } from "../utils";

const instructions = readLines("/8/input.txt");

function run(instructions: string[]): [finished: boolean, acc: number] {
  const executed = new Set<number>();
  let acc = 0;
  let index = 0;

  function execute(instruction: string) {
    const [operation, argument] = instruction.split(" ");
    let offset = 1;
    switch (operation) {
      case "acc":
        acc += parseInt(argument);
        break;
      case "jmp":
        offset = parseInt(argument);
        break;
      default:
        break;
    }
    index += offset;
  }

  let instruction = "";
  while (true) {
    instruction = instructions[index];
    if (!instruction && index === instructions.length) {
      return [true, acc];
    } else if (!instruction) {
      return [false, acc];
    } else if (executed.has(index)) {
      return [false, acc];
    } else {
      executed.add(index);
      execute(instruction);
    }
  }
}

(function partOne() {
  console.log(run(instructions)[1]);
})();

(function partTwo() {
  const pool = instructions.reduce<number[]>((acc, instr, idx) => {
    if (/nop|jmp/.test(instr)) {
      acc.push(idx);
    }
    return acc;
  }, []);

  for (const index of pool) {
    const instructionsCopy = instructions.slice();
    const instruction = instructionsCopy[index];
    if (/nop/.test(instruction)) {
      instructionsCopy[index] = instruction.replace("nop", "jmp");
    } else {
      instructionsCopy[index] = instruction.replace("jmp", "nop");
    }
    const [finsished, acc] = run(instructionsCopy);
    if (finsished) {
      console.log(acc);
      break;
    }
  }
})();
