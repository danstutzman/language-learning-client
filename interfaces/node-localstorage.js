declare module "node-localstorage" {
  declare class LocalStorage {
    constructor(path: string): LocalStorage;
    getItem(key: string): string;
    setItem(key: string, value: string): null;
  }

  declare var LocalStorage:LocalStorage;
}
