import { readInputFile } from "../utils";

function reverse(str: string) {
  return str.split("").reverse().join("");
}

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
    this.data = this.data.map((row) => reverse(row));
    // update connections
    // const [top, , bottom] = this.data;
    // this.data[0] = bottom;
    // this.data[2] = top;
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
const tilesById = tiles.reduce<Record<string, Tile>>((acc, tile) => {
  acc[tile.id] = tile;
  return acc;
}, {});
const edges = tiles.reduce<Record<string, string[]>>((acc, tile) => {
  for (let side = 0; side < 4; side++) {
    const edge = tile.getSide(side);
    const flipped = reverse(edge);
    if (acc[edge] || acc[flipped]) {
      const key = acc[edge] ? edge : flipped;
      acc[key].push(tile.id);
    } else {
      acc[edge] = [tile.id];
    }
  }
  return acc;
}, {});

// ------------- part 1 -------------

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

// ------------- part 2 -------------

// let it be the top left tile
const topLeft =
  tilesById[Object.keys(counter).find((tile) => counter[tile] === 2)!];

function isTileAligned(tile: Tile) {
  const topEdge = tile.getSide(0);
  const topEdgeFlipped = reverse(topEdge);
  const leftEdge = tile.getSide(3);
  const leftEdgeFlipped = reverse(leftEdge);
  return (
    (edges[topEdge]?.length === 1 || edges[topEdgeFlipped]?.length === 1) &&
    (edges[leftEdge]?.length === 1 || edges[leftEdgeFlipped]?.length === 1)
  );
}

(function prepareTopLeft() {
  for (let i = 0; i < 8; i++) {
    if (i === 4) topLeft.flip();
    if (isTileAligned(topLeft)) {
      topLeft.connections[1] = (
        edges[topLeft.getSide(1)] ?? edges[reverse(topLeft.getSide(1))]
      )
        .filter((tileId) => tileId !== topLeft.id)
        .pop();
      topLeft.connections[2] = (
        edges[topLeft.getSide(2)] ?? edges[reverse(topLeft.getSide(2))]
      )
        .filter((tileId) => tileId !== topLeft.id)
        .pop();

      break;
    }
    topLeft.rotate();
  }
})();

function updateAdjacent(tile: Tile) {
  const tiles: Tile[] = [];
  const sides = [1, 2];
  for (const side of sides) {
    const edge = tile.getSide(side);
    const adjacentTile = tile.connections[side]
      ? tilesById[tile.connections[side]!]
      : undefined;
    if (!adjacentTile) continue;
    tiles.push(adjacentTile);

    for (let i = 0; i < 8; i++) {
      if (i === 4) adjacentTile.flip();

      const adjacentEdge = adjacentTile.getSide((side + 2) % 4);
      if (adjacentEdge === edge) {
        adjacentTile.connections[1] = (
          edges[adjacentTile.getSide(1)] ??
          edges[reverse(adjacentTile.getSide(1))]
        )
          .filter((tileId) => tileId !== adjacentTile.id)
          .pop();
        adjacentTile.connections[2] = (
          edges[adjacentTile.getSide(2)] ??
          edges[reverse(adjacentTile.getSide(2))]
        )
          .filter((tileId) => tileId !== adjacentTile.id)
          .pop();
        break;
      }

      adjacentTile.rotate();
    }
  }
  return tiles;
}

(function bfs() {
  const visited = new Set<string>();
  const tilesToVisit: Tile[] = [topLeft];
  do {
    const tile = tilesToVisit.shift()!;
    visited.add(tile.id);
    const tiles = updateAdjacent(tile);
    tiles.forEach((t) => {
      if (
        !visited.has(t.id) &&
        !tilesToVisit.find((tileToVisit) => tileToVisit.id === t.id)
      ) {
        tilesToVisit.push(t);
      }
    });
  } while (tilesToVisit.length);
})();

// remove borders
tiles.forEach((tile) => {
  tile.data = tile.data.slice(1, -1).map((row) => row.slice(1, -1));
});

// combine
let firstInLine: Tile | undefined = topLeft;
const data: string[][][] = [];
while (firstInLine) {
  data.push([]);
  let next: Tile | undefined = firstInLine;
  while (next) {
    data[data.length - 1].push(next.data);
    next = next.connections[1] ? tilesById[next.connections[1]] : undefined;
  }
  firstInLine = firstInLine.connections[2]
    ? tilesById[firstInLine.connections[2]]
    : undefined;
}

const reducedData = data
  .map((row) => {
    return row.reduce((acc, tile) => {
      return acc.map((line, index) => line + tile[index]);
    });
  })
  .reduce((acc, row) => {
    return acc.concat(row);
  });

// check if orientation is correct by searching for patterns
const map = new Tile("0", reducedData);

function findSeaMonsterInSlice(mapSlice: string[]) {
  const re1 = /..................#./g;
  const re2 = /#....##....##....###/g;
  const re3 = /.#..#..#..#..#..#.../g;
  const [line1, line2, line3] = mapSlice;
  const matches = line2.matchAll(re2);

  let counter = 0;

  for (const match of matches) {
    if (match.index === undefined) continue;
    const from = match.index;
    const to = match.index + match[0].length;
    if (re1.test(line1.slice(from, to)) && re3.test(line3.slice(from, to))) {
      counter++;
    }
  }
  return counter;
}

function findSeaMonsters(data: string[]) {
  let total = 0;
  for (let row = 0; row < data.length - 3; row++) {
    const found = findSeaMonsterInSlice(data.slice(row, row + 3));
    if (found) {
      total += found;
    }
  }
  return total;
}

let monsterCount = 0;
for (let i = 0; i < 8; i++) {
  if (i === 4) map.flip();
  monsterCount = findSeaMonsters(map.data);
  if (monsterCount) break;
  map.rotate();
}

const roughness =
  Array.prototype.filter.call(map.data.join(""), (char) => char === "#")
    .length -
  monsterCount * 15;

// console.log(monsterCount);
console.log(roughness);
// console.table(map.data);

// ------------- 🤯 -------------
