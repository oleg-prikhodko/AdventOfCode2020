import { readLines } from "../utils";

let layers = [readLines("/17/input.txt")];

function getAdjacentFromLayer(layer: string[], row: number, col: number) {
  return [
    layer[row][col - 1],
    layer[row][col + 1],
    layer?.[row + 1]?.[col],
    layer?.[row - 1]?.[col],
    layer?.[row - 1]?.[col - 1],
    layer?.[row - 1]?.[col + 1],
    layer?.[row + 1]?.[col - 1],
    layer?.[row + 1]?.[col + 1],
  ];
}

function getAdjacent(layerIndex: number, row: number, col: number) {
  const layer = layers[layerIndex];
  const prevLayer = layers[layerIndex - 1];
  const nextLayer = layers[layerIndex + 1];

  let adjacent = getAdjacentFromLayer(layer, row, col);
  if (prevLayer) {
    adjacent = adjacent.concat(getAdjacentFromLayer(prevLayer, row, col));
    adjacent.push(prevLayer[row][col]);
  }
  if (nextLayer) {
    adjacent = adjacent.concat(getAdjacentFromLayer(nextLayer, row, col));
    adjacent.push(nextLayer[row]?.[col]);
  }
  return adjacent;
}

function update(layerIndex: number, row: number, col: number) {
  const adjacent = getAdjacent(layerIndex, row, col);
  const cube = layers[layerIndex][row][col];
  const adjacentActive = adjacent.filter((adj) => adj === "#").length;
  if (cube === "#") {
    return adjacentActive === 2 || adjacentActive === 3 ? "#" : ".";
  } else {
    return adjacentActive === 3 ? "#" : ".";
  }
}

function tick() {
  const updatedLayers: string[][] = [];
  for (const [layerIdx, layer] of layers.entries()) {
    const updatedLayer = layer.map((row, rowIdx) =>
      row
        .split("")
        .map((col, colIdx) => update(layerIdx, rowIdx, colIdx))
        .join("")
    );
    updatedLayers.push(updatedLayer);
  }
  return updatedLayers;
}

function addOuterShell(layer: string[]) {
  const size = layer.length;
  const newSize = size + 2;
  const prevRow = ".".repeat(newSize);
  const nextRow = ".".repeat(newSize);
  return [prevRow, ...layer.map((row) => "." + row + "."), nextRow];
}

(function simulate(ticks = 6) {
  for (let i = 0; i < ticks; i++) {
    // add outer shell
    layers = layers.map(addOuterShell);

    // add prev/next layers
    const size = layers[0].length;
    layers.unshift(Array(size).fill(".".repeat(size)));
    layers.push(Array(size).fill(".".repeat(size)));

    // update each
    layers = tick();
  }

  // layers.forEach((layer, idx) => {
  //   console.log("Layer:", idx);
  //   console.table(layer);
  // });

  const totalActive = layers.reduce(
    (acc, layer) =>
      acc +
      layer.reduce(
        (acc, row) =>
          acc + Array.prototype.filter.call(row, (char) => char === "#").length,
        0
      ),
    0
  );
  console.log(totalActive);
})();
