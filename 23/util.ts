class ListNode<T> {
  value: T;
  next?: ListNode<T>;
  constructor(value: T) {
    this.value = value;
  }
}

export class Circle {
  current: ListNode<number>;
  lowest: number;
  highest: number;
  allCups: Set<number>;
  nodesByCup: ListNode<number>[];

  constructor(cups: number[]) {
    this.lowest = cups.reduce((acc, cup) => (cup < acc ? cup : acc));
    this.highest = cups.reduce((acc, cup) => (cup > acc ? cup : acc));

    this.allCups = new Set(cups);
    this.nodesByCup = [];

    const nodes = cups.map((cup) => new ListNode(cup));
    nodes.forEach((node, index) => {
      node.next = nodes[index + 1] ?? nodes[0];
      this.nodesByCup[node.value] = node;
    });

    this.current = nodes[0];
  }

  pickNext(destination: ListNode<number>) {
    const node = destination.next!;
    const nextOfNext = node.next;
    destination.next = nextOfNext;
    return node.value;
  }

  pickNCupsAfterCurrent(n = 3) {
    const cups: number[] = [];
    for (let i = 0; i < n; i++) {
      cups.push(this.pickNext(this.current));
    }
    return cups;
  }

  insert(destination: ListNode<number>, value: number) {
    const node = new ListNode(value);
    this.nodesByCup[value] = node;
    node.next = destination.next;
    destination.next = node;
    return node;
  }

  insertNAfterDestination(destination: ListNode<number>, values: number[]) {
    let node = destination;
    for (const value of values) {
      node = this.insert(node, value);
    }
  }

  getDestination(pickedUp: number[]) {
    let destinationCupValue = this.current.value;
    do {
      destinationCupValue--;
      if (destinationCupValue < this.lowest) {
        destinationCupValue = this.highest;
      }
    } while (
      pickedUp.includes(destinationCupValue) ||
      !this.allCups.has(destinationCupValue)
    );

    return this.nodesByCup[destinationCupValue];
  }
}

export function nodesToList<T>(node: ListNode<T>) {
  const list: T[] = [];
  let current = node;
  do {
    list.push(current.value);
    current = current.next!;
  } while (current !== node);
  return list;
}
