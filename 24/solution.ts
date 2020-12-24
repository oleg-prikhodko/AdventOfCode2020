import { Counter, readLines } from "../utils";

function* parseLine(line: string) {
  const doubles = ["se", "sw", "ne", "nw"];
  const singles = ["e", "w"];

  while (true) {
    const chars = line.slice(0, 2);
    const char = line[0];

    if (doubles.includes(chars)) {
      yield chars;
      if (line.length === 2) {
        break;
      } else {
        line = line.slice(2);
      }
    } else if (singles.includes(char)) {
      yield char;
      if (line.length === 1) {
        break;
      } else {
        line = line.slice(1);
      }
    } else {
      throw new Error("incorrect char");
    }
  }
}

function getCoords(movements: Iterable<string>) {
  let x = 0;
  let y = 0;
  for (const movement of movements) {
    switch (movement) {
      case "e":
        x++;
        break;
      case "w":
        x--;
        break;

      case "ne":
        y++;
        break;
      case "sw":
        y--;
        break;

      case "nw":
        y++;
        x--;
        break;
      case "se":
        y--;
        x++;
        break;

      default:
        throw new Error("Incorrect direction");
    }
  }
  return [x, y];
}

const counter = new Counter();
readLines("/24/input.txt").forEach((line) => {
  counter.add(JSON.stringify(getCoords(parseLine(line))));
});

const blackTilesCoords = Object.keys(counter.results).filter(
  (coord) => counter.results[coord] % 2 === 1
);
console.log(blackTilesCoords.length);

// part 2

type Coords = [x: number, y: number];

class Tile {
  readonly x: number;
  readonly y: number;
  readonly isBlack: boolean;
  readonly coords: Coords;
  readonly adjacentCoords: Coords[];

  constructor(coords: Coords, isBlack = false) {
    this.x = coords[0];
    this.y = coords[1];
    this.isBlack = isBlack;

    this.coords = [this.x, this.y];
    this.adjacentCoords = [
      [this.x + 1, this.y],
      [this.x - 1, this.y],
      [this.x, this.y + 1],
      [this.x, this.y - 1],
      [this.x - 1, this.y + 1],
      [this.x + 1, this.y - 1],
    ];
  }

  getCoords() {
    return this.coords;
  }

  getAdjacentCoords(): Coords[] {
    return this.adjacentCoords;
  }
}

function getNextTileValue(tiles: Map<string, Tile>, tile: Tile) {
  const coords = tile.getCoords();
  const adjacentTiles = tile
    .getAdjacentCoords()
    .map((coords) => tiles.get(JSON.stringify(coords)))
    .filter((tile) => tile !== undefined) as Tile[];

  const adjacentBlackTiles = adjacentTiles.filter((tile) => tile.isBlack)
    .length;

  if (tile.isBlack) {
    return adjacentBlackTiles === 0 || adjacentBlackTiles > 2
      ? new Tile(coords)
      : tile;
  } else {
    return adjacentBlackTiles === 2 ? new Tile(coords, true) : tile;
  }
}

function tick(blackTiles: Map<string, Tile>) {
  const tiles = new Map(blackTiles);
  blackTiles.forEach((tile) => {
    const adjacentCoords = tile.getAdjacentCoords();
    for (const coords of adjacentCoords) {
      const coordStr = JSON.stringify(coords);
      if (!tiles.has(coordStr)) {
        tiles.set(coordStr, new Tile(coords));
      }
    }
  });

  const nextBlackTiles = new Map<string, Tile>();
  tiles.forEach((tile, coordStr) => {
    const nextTile = getNextTileValue(tiles, tile);
    if (nextTile.isBlack) {
      nextBlackTiles.set(coordStr, nextTile);
    }
  });

  return nextBlackTiles;
}

function getBlackTilesAfterDays(days = 100) {
  let blackTiles = blackTilesCoords.reduce((acc, coordStr) => {
    acc.set(coordStr, new Tile(eval(coordStr), true));
    return acc;
  }, new Map<string, Tile>());

  for (let i = 1; i <= days; i++) {
    blackTiles = tick(blackTiles);
  }

  return blackTiles.size;
}

console.log(getBlackTilesAfterDays());
