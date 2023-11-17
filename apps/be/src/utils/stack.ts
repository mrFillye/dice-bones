export class Stack<T> {
  private storage: T[] = [];

  constructor(initial?: T[]) {
    if (initial) {
      this.storage = initial;
    }
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.storage.pop();
  }

  push(data: T): void {
    this.storage.push(data);
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.storage[this.storage.length - 1];
  }

  isEmpty(): boolean {
    return this.storage.length === 0;
  }

  clear(): void {
    this.storage = [];
  }

  size(): number {
    return this.storage.length;
  }

  sort(compareFn?: (a: T, b: T) => number): void {
    this.storage.sort(compareFn);
  }

  remove(predicate: (value: T, index: number, array: T[]) => boolean) {
    const index = this.storage.findIndex(predicate);
    if (index !== -1) {
      const [result] = this.storage.splice(index, 1);
      return result;
    }
  }
}
