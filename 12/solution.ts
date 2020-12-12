import { readLines } from "../utils";

function parseInstruction(line: string): [string, number] {
  const match = /(\w)(\d+)/.exec(line)!;
  const cmd = match[1];
  const val = parseInt(match[2]);
  return [cmd, val];
}

const instructions = readLines("/12/input.txt").map(parseInstruction);

const directions = ["N", "E", "S", "W"];
const directionsReverse = directions.slice().reverse();

function getDirection(dir: string, angle: number, clockwise = true) {
  const dirs = clockwise ? directions : directionsReverse;
  const offset = angle / 90;
  const currentIndex = dirs.findIndex((d) => d === dir);
  return dirs[(currentIndex + offset) % 4];
}

function distance(x: number, y: number) {
  return Math.abs(x) + Math.abs(y);
}

function calcOffset(dir: string, val: number): [number, number] {
  switch (dir) {
    case "N":
      return [0, val];
    case "S":
      return [0, -val];
    case "E":
      return [val, 0];
    case "W":
      return [-val, 0];
    default:
      return [0, 0];
  }
}

function part1() {
  let x = 0;
  let y = 0;
  let dir = "E";

  function process([cmd, val]: [string, number]) {
    if (directions.includes(cmd) || cmd === "F") {
      const [xOffset, yOffset] = calcOffset(cmd === "F" ? dir : cmd, val);
      x += xOffset;
      y += yOffset;
    } else if (cmd === "L" || cmd === "R") {
      const clockwise = cmd === "R";
      dir = getDirection(dir, val, clockwise);
    }
  }

  instructions.forEach(process);
  console.log(distance(x, y));
}

part1();

function rotateWaypoint(
  waypoint_x: number,
  waypoint_y: number,
  clockwise: boolean,
  angle: number
) {
  let x = 0;
  let y = 0;

  const updateWaypointCoords = (newDir: string, oldVal: number) => {
    switch (newDir) {
      case "N":
        y = Math.abs(oldVal);
        break;
      case "S":
        y = -Math.abs(oldVal);
        break;
      case "E":
        x = Math.abs(oldVal);
        break;
      case "W":
        x = -Math.abs(oldVal);
        break;
    }
  };

  const firstDir = waypoint_x >= 0 ? "E" : "W";
  const newFirstDir = getDirection(firstDir, angle, clockwise);
  updateWaypointCoords(newFirstDir, waypoint_x);

  const secondDir = waypoint_y >= 0 ? "N" : "S";
  const newSecondDir = getDirection(secondDir, angle, clockwise);
  updateWaypointCoords(newSecondDir, waypoint_y);

  return [x, y];
}

function part2() {
  let ship_x = 0;
  let ship_y = 0;
  let waypoint_x = 10;
  let waypoint_y = 1;

  function process([cmd, val]: [string, number]) {
    if (directions.includes(cmd)) {
      const [xOffset, yOffset] = calcOffset(cmd, val);
      waypoint_x += xOffset;
      waypoint_y += yOffset;
    } else if (cmd === "F") {
      ship_x += waypoint_x * val;
      ship_y += waypoint_y * val;
    } else if (cmd === "L" || cmd === "R") {
      const clockwise = cmd === "R";
      [waypoint_x, waypoint_y] = rotateWaypoint(
        waypoint_x,
        waypoint_y,
        clockwise,
        val
      );
    }
  }

  instructions.forEach(process);
  console.log(distance(ship_x, ship_y));
}

part2();
