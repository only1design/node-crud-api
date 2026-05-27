export interface Collection<T> {
  get(id: string): T | undefined;
  set(id: string, value: T): T;
  delete(id: string): boolean;
  getAll(): T[];
}

export interface IInMemoryDB {
  collection<T>(name: string): Collection<T>;
}

export const createInMemoryDB = (): IInMemoryDB => {
  const collections = new Map<string, Map<string, unknown>>();

  function getOrCreateCollection<T>(name: string): Map<string, T> {
    if (!collections.has(name)) {
      collections.set(name, new Map());
    }
    return collections.get(name) as Map<string, T>;
  }

  return {
    collection<T>(name: string): Collection<T> {
      const store = getOrCreateCollection<T>(name);

      return {
        get(id: string) {
          return store.get(id);
        },

        set(id: string, value: T) {
          store.set(id, value);
          return value;
        },

        delete(id: string) {
          return store.delete(id);
        },

        getAll() {
          return Array.from(store.values());
        },
      };
    },
  };
};
