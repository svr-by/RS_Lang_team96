class StorageService {
  getLocal<T>(key: string): null | T {
    const value = sessionStorage.getItem(key);

    return value && JSON.parse(value);
  }

  setLocal<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSession<T>(key: string): null | T {
    const value = sessionStorage.getItem(key);

    return value && JSON.parse(value);
  }

  setSession<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export const storageService = new StorageService();
