import { readLines } from "../utils";

const grid = {
  _lines: readLines("/3/input.txt"),
  cell(row: number, col: number) {
    const totalRows = this._lines.length;
    const totalCols = this._lines[0].length;
    return row >= totalRows ? undefined : this._lines[row][col % totalCols];
  },
  path(rowShift = 1, colShift = 3) {
    let row = rowShift;
    let col = colShift;
    const path: string[] = [];
    let res: string | undefined;
    while ((res = this.cell(row, col))) {
      row += rowShift;
      col += colShift;
      path.push(res);
    }
    return path;
  },
};

function howManyTrees(rowShift = 1, colShift = 3) {
  return grid.path(rowShift, colShift).filter((cell) => cell === "#").length;
}

console.log(howManyTrees());

function product() {
  return [
    howManyTrees(1, 1),
    howManyTrees(1, 3),
    howManyTrees(1, 5),
    howManyTrees(1, 7),
    howManyTrees(2, 1),
  ].reduce((acc, el) => acc * el);
}

console.log(product());
