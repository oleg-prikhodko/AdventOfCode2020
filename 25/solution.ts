function transform(subject: number, loopSize: number) {
  let value = subject;
  let loop = 1;
  while (loop < loopSize) {
    value = value * subject;
    value = value % 20201227;
    loop++;
  }
  return value;
}

function* getValueStream(subject: number) {
  let value = 1;
  while (true) {
    value = value * subject;
    value = value % 20201227;
    yield value;
  }
}

function getLoopValue(pk: number, subject: number) {
  const valueStream = getValueStream(subject);
  let loop = 1;
  for (const value of valueStream) {
    if (value === pk) break;
    loop++;
  }

  return loop;
}

const subject = 7;
const cardsPk = 8252394;
const doorsPk = 6269621;

const cardsLoopSize = getLoopValue(cardsPk, subject);
const encryptionKey = transform(doorsPk, cardsLoopSize);
console.log(encryptionKey);
