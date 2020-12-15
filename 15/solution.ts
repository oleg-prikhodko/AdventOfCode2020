const nums = [1, 0, 18, 10, 19, 6];

function calc(limit: number) {
  let lastSpoken = nums[nums.length - 1];
  let turn = nums.length + 1;

  // https://stackoverflow.com/a/49164774
  // it took just 9 seconds to complete when using Map!
  // much faster than using object for 'mem' (almost 10 minutes)
  const mem = nums.reduce<Map<number, number>>((acc, num, idx) => {
    acc.set(num, idx + 1);
    return acc;
  }, new Map());

  while (turn <= limit) {
    const nextNum = mem.has(lastSpoken) ? turn - 1 - mem.get(lastSpoken)! : 0;
    mem.set(lastSpoken, turn - 1);
    lastSpoken = nextNum;
    turn++;
  }

  return lastSpoken;
}

console.log(calc(2020));
console.log(calc(30_000_000));
