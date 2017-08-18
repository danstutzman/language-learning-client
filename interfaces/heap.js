declare module "heap" {
  declare export default class Heap {
    constructor(comparer: any): Heap;
    empty(): boolean;
    peek(): any;
    push(item: any): void;
    pop(): any;
    updateItem(item: any): void;
    size(): number;
  }
}
