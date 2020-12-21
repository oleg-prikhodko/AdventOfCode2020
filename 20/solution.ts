import { readInputFile } from "../utils";

function parseTile(tileData: string) {
  const [header, ...data] = tileData.split("\n");
  const id = /Tile (\d+):/.exec(header)![1];
  return new Tile(id, data);
}

type Connection = string | undefined;

class Tile {
  id: string;
  data: string[];
  size: number;
  connections: Connection[]; // top, right, bottom, left

  constructor(id: string, data: string[]) {
    this.id = id;
    this.data = data;
    this.size = data[0].length;
    this.connections = Array(4).fill(undefined);
  }

  rotate() {
    const data: string[] = [];
    for (let i = 0; i < this.size; i++) {
      const row = this.data
        .map((row) => row[i])
        .reverse()
        .join("");
      data.push(row);
    }
    this.data = data;
    // update connections
    const left = this.connections.pop();
    this.connections = [left, ...this.connections];
  }

  flip() {
    this.data.reverse();
    // update connections
    const [top, , bottom] = this.data;
    this.data[0] = bottom;
    this.data[2] = top;
  }

  getSide(side: number): string {
    switch (side) {
      case 0:
        return this.data[0];
      case 1:
        return this.data.map((row) => row[this.size - 1]).join("");
      case 2:
        return this.data[this.size - 1];
      case 3:
        return this.data.map((row) => row[0]).join("");
      default:
        throw new Error("incorrect side");
    }
  }
}

const tiles = readInputFile("/20/input.txt").split("\n\n").map(parseTile);
const edges = tiles.reduce<Record<string, string[]>>((acc, tile) => {
  for (let side = 0; side < 4; side++) {
    const edge = tile.getSide(side);
    const flipped = edge.split("").reverse().join("");
    if (acc[edge] || acc[flipped]) {
      const key = acc[edge] ? edge : flipped;
      acc[key].push(tile.id);
    } else {
      acc[edge] = [tile.id];
    }
  }
  return acc;
}, {});
const adjacentEdges = Object.values(edges).filter(
  (tiles) => tiles.length === 2
);

const counter: Record<string, number> = {};
for (const tiles of adjacentEdges) {
  for (const tile of tiles) {
    if (counter[tile]) {
      counter[tile]++;
    } else {
      counter[tile] = 1;
    }
  }
}

const product = Object.keys(counter).reduce((acc, key) => {
  return counter[key] === 2 ? acc * parseInt(key) : acc;
}, 1);

console.log(product);
