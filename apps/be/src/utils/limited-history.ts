export class LimitedHistory<T> {
  private items: T[] = [];
  constructor(private readonly limit: number = 5) {}

  public append(item: T) {
    if (this.items.length >= this.limit) {
      this.items.shift();
    }
    this.items.push(item);
    return this.items.length;
  }

  public toArray() {
    return this.items;
  }
}
