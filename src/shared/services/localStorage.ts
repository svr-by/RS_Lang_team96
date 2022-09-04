class LocalStorage {
  get<T>(key: string): null | T {
    const a = localStorage.getItem(key);

    return a && JSON.parse(a);
  }

  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export default LocalStorage;
