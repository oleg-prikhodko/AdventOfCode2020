const nums = [0, 3, 6];
let spoken: number[] = [];
const mem: Record<number, number[]> = {};
let turn = 1;

while (turn <= 30_000_000) {
  if (turn <= nums.length) {
    const num = nums[turn - 1];
    spoken.push(num);
    mem[num] = [turn];
  } else {
    const prevNum = spoken[spoken.length - 1];
    let numToSpeak = 0;
    if (mem[prevNum].length > 1) {
      const turns = mem[prevNum];
      numToSpeak = turns[turns.length - 1] - turns[turns.length - 2];
    }
    spoken.push(numToSpeak);
    mem[numToSpeak] ? mem[numToSpeak].push(turn) : (mem[numToSpeak] = [turn]);
  }
  turn++;
}

console.log(spoken.slice(-1));
