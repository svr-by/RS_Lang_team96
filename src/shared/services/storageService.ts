class StorageService {
  getLocal<T>(key: string): null | T {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }

  setLocal<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeLocal(key: string) {
    localStorage.removeItem(key);
  }

  getSession<T>(key: string): null | T {
    const value = sessionStorage.getItem(key);
    return value && JSON.parse(value);
  }

  setSession<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeSession(key: string) {
    sessionStorage.removeItem(key);
  }
}

export const storageService = new StorageService();
