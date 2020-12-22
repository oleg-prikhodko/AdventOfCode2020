import { readInputFile } from "../utils";

class Player {
  name: string;
  cards: number[];
  constructor(name: string, cards: number[]) {
    this.name = name;
    this.cards = cards;
  }
  get score() {
    const reversed = this.cards.slice().reverse();
    return reversed.reduce((acc, card, idx) => {
      return acc + card * (idx + 1);
    }, 0);
  }
}

class Game {
  player_1: Player;
  player_2: Player;
  constructor(player_1: Player, player_2: Player) {
    this.player_1 = player_1;
    this.player_2 = player_2;
  }
  play() {
    while (this.player_1.cards.length && this.player_2.cards.length) {
      const card_1 = this.player_1.cards.shift()!;
      const card_2 = this.player_2.cards.shift()!;
      if (card_1 > card_2) {
        this.player_1.cards.push(card_1, card_2);
      } else {
        this.player_2.cards.push(card_2, card_1);
      }
    }
    return this.player_1.cards.length ? this.player_1 : this.player_2;
  }
}

function parsePlayer(input: string) {
  input.split("\n").slice(1).map(Number);
  const [header, ...other] = input.split("\n");
  return new Player(header.slice(0, -1), other.map(Number));
}

function getPlayers() {
  return readInputFile("/22/input.txt").split("\n\n").map(parsePlayer);
}

const [p1_1, p1_2] = getPlayers();
const game = new Game(p1_1, p1_2);
const winner = game.play();
console.log(winner.score);

class RecursiveGame extends Game {
  round: number;
  prevStates: Set<string>;
  constructor(player_1: Player, player_2: Player) {
    super(player_1, player_2);
    this.prevStates = new Set();
    this.round = 0;
  }
  play() {
    while (this.player_1.cards.length && this.player_2.cards.length) {
      this.round++;
      const state = JSON.stringify([this.player_1.cards, this.player_2.cards]);
      if (this.prevStates.has(state)) {
        return this.player_1;
      } else {
        this.prevStates.add(state);
      }

      const card_1 = this.player_1.cards.shift()!;
      const card_2 = this.player_2.cards.shift()!;

      if (
        this.player_1.cards.length >= card_1 &&
        this.player_2.cards.length >= card_2
      ) {
        // recurse into subgame
        const subgame = new RecursiveGame(
          new Player(this.player_1.name, this.player_1.cards.slice(0, card_1)),
          new Player(this.player_2.name, this.player_2.cards.slice(0, card_2))
        );
        const winner = subgame.play();
        if (winner.name === this.player_1.name) {
          this.player_1.cards.push(card_1, card_2);
        } else {
          this.player_2.cards.push(card_2, card_1);
        }
      } else {
        if (card_1 > card_2) {
          this.player_1.cards.push(card_1, card_2);
        } else {
          this.player_2.cards.push(card_2, card_1);
        }
      }
    }
    return this.player_1.cards.length ? this.player_1 : this.player_2;
  }
}

const [p2_1, p2_2] = getPlayers();
const recGame = new RecursiveGame(p2_1, p2_2);
const recWinnner = recGame.play();
console.log(recWinnner.score);
