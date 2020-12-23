import { range } from "../utils";
import { Circle, nodesToList } from "./util";

class Game {
  circle: Circle;
  move: number;
  maxMoves: number;

  constructor(cups: number[], moves = 100) {
    this.circle = new Circle(cups);
    this.move = 1;
    this.maxMoves = moves;
  }

  play() {
    while (this.move <= this.maxMoves) {
      const cups = this.circle.pickNCupsAfterCurrent();
      const destination = this.circle.getDestination(cups);
      this.circle.insertNAfterDestination(destination, cups);
      this.circle.current = this.circle.current.next!;

      this.move++;
    }
    return this.circle.current;
  }
}

function parseInput(input = "643719258") {
  return input.split("").map(Number);
}

function makeMillion(cups: number[]) {
  const highest = cups.reduce((acc, cup) => (cup > acc ? cup : acc));
  return cups.concat(Array.from(range(highest + 1, 1_000_000)));
}

function arrange(cups: string) {
  const [tail, head] = cups.split("1");
  return [...head, ...tail].join("");
}

const game_1 = new Game(parseInput());
const current = game_1.play();
console.log(arrange(nodesToList(current).join("")));

const game_2 = new Game(makeMillion(parseInput()), 10_000_000);
game_2.play();
const one = game_2.circle.nodesByCup[1];
console.log(one.next?.value! * one.next?.next?.value!);
