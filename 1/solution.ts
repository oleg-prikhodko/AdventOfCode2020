import { readLines } from "../utils";

const arr = readLines("1.txt").map(Number);

function findTwo() {
  for (const [index, first] of arr.entries()) {
    const arrCopy = arr.slice();
    arrCopy.splice(index, 1);
    const second = arrCopy.find((el) => first + el === 2020);
    if (second) {
      return first * second;
    }
  }
}

console.log(findTwo());

function findThree() {
  for (const [index, first] of arr.entries()) {
    const arrCopy = arr.slice();
    arrCopy.splice(index, 1);

    for (const [index, second] of arrCopy.entries()) {
      const cpy = arrCopy.slice();
      cpy.splice(index, 1);
      const third = cpy.find((el) => first + second + el === 2020);
      if (third) {
        return first * second * third;
      }
    }
  }
}

console.log(findThree());
