import { readLines } from "../utils";

function getAdjacentOccupiedSeats(lines: string[], row: number, col: number) {
  return [
    lines[row][col - 1],
    lines[row][col + 1],
    lines?.[row + 1]?.[col],
    lines?.[row - 1]?.[col],
    lines?.[row - 1]?.[col - 1],
    lines?.[row - 1]?.[col + 1],
    lines?.[row + 1]?.[col - 1],
    lines?.[row + 1]?.[col + 1],
  ].filter((cell) => cell === "#");
}

function update(
  lines: string[],
  row: number,
  col: number,
  getAdjacent: (lines: string[], row: number, col: number) => string[],
  toleratedSeats: number
) {
  const cell = lines[row][col];
  if (cell === ".") return cell;

  const adjacentOccupied = getAdjacent(lines, row, col);

  if (cell === "L" && !adjacentOccupied.length) {
    return "#";
  } else if (cell === "#" && adjacentOccupied.length >= toleratedSeats) {
    return "L";
  } else {
    return cell;
  }
}

function run(getAdjacent: typeof getAdjacentOccupiedSeats, toleratedSeats = 4) {
  let prevLines = readLines("/11/input.txt");
  while (true) {
    const currentLines = prevLines.map((line, row) =>
      Array.prototype.map
        .call(line, (_, col) =>
          update(prevLines, row, col, getAdjacent, toleratedSeats)
        )
        .join("")
    );

    // console.table(prevLines);
    // console.table(currentLines);

    const prevLinesSnapshot = prevLines.join("");
    const currentLinesSnapshot = currentLines.join("");

    if (prevLinesSnapshot === currentLinesSnapshot) {
      return Array.prototype.filter.call(
        currentLinesSnapshot,
        (cell) => cell === "#"
      ).length;
    } else {
      prevLines = currentLines;
    }
  }
}

console.log(run(getAdjacentOccupiedSeats));

function getAdjacentInEachDirection(lines: string[], row: number, col: number) {
  const nextSeatInDirection = (rowOffset: number, colOffset: number) => {
    let coeff = 1;
    let cell: string | undefined;
    do {
      cell = lines?.[row + coeff * rowOffset]?.[col + coeff * colOffset];
      coeff++;
    } while (cell === ".");
    return cell;
  };

  return [
    nextSeatInDirection(0, -1),
    nextSeatInDirection(0, 1),
    nextSeatInDirection(1, 0),
    nextSeatInDirection(-1, 0),
    nextSeatInDirection(-1, -1),
    nextSeatInDirection(-1, 1),
    nextSeatInDirection(1, -1),
    nextSeatInDirection(1, 1),
  ].filter((cell) => cell === "#");
}

console.log(run(getAdjacentInEachDirection, 5));
