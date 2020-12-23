class CupCircle {
  cups: number[];
  lowest: number;
  highest: number;
  current: number;

  constructor(cups: number[]) {
    this.cups = cups;
    this.lowest = cups.reduce((lowest, cup) => (cup < lowest ? cup : lowest));
    this.highest = cups.reduce((highest, cup) =>
      cup > highest ? cup : highest
    );
    this.current = cups[0];
  }

  getCurrentIndex() {
    const index = this.cups.findIndex((cup) => cup === this.current);
    if (index < 0) throw new Error("incorrect index");
    return index;
  }

  getIndexFromCurrent(offset: number) {
    const currentIndex = this.getCurrentIndex();
    return (currentIndex + offset) % this.cups.length;
  }

  pick() {
    const [a] = this.cups.splice(this.getIndexFromCurrent(1), 1);
    const [b] = this.cups.splice(this.getIndexFromCurrent(1), 1);
    const [c] = this.cups.splice(this.getIndexFromCurrent(1), 1);
    return [a, b, c];
  }

  getDestinationIndex(pickedUp: number[]) {
    const allCups = new Set(this.cups);
    let destinationCup = this.current;
    do {
      destinationCup--;
      if (destinationCup < this.lowest) {
        destinationCup = this.highest;
      }
    } while (pickedUp.includes(destinationCup) || !allCups.has(destinationCup));
    return this.cups.findIndex((cup) => cup === destinationCup);
  }

  insert(destinationIndex: number, cups: number[]) {
    this.cups.splice(destinationIndex + 1, 0, ...cups);
    this.current = this.cups[this.getIndexFromCurrent(1)];
  }
}

class Game {
  circle: CupCircle;
  move: number;
  maxMoves: number;

  constructor(cups: number[], moves = 100) {
    this.circle = new CupCircle(cups);
    this.move = 1;
    this.maxMoves = moves;
  }

  play() {
    while (this.move <= this.maxMoves) {
      const cups = this.circle.pick();
      const destIndex = this.circle.getDestinationIndex(cups);
      this.circle.insert(destIndex, cups);

      this.move++;
    }
    return this.circle.cups;
  }
}

function parseInput(input = "643719258") {
  return input.split("").map(Number);
}

const game = new Game(parseInput());
const cups = game.play();
console.log(arrange(cups));

function arrange(cups: number[]) {
  const [tail, head] = cups.join("").split("1");
  return [...head, ...tail].join("");
}
