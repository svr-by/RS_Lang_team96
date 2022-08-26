class Storage {
  get<T>(key: string): null | T {
    const a = sessionStorage.getItem(key);

    return a && JSON.parse(a);
  }

  set<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export default Storage;
