class Words {
  getWords(page: number, group: number) {
    let url = 'https://rslang-team96.herokuapp.com/words?';
    if (page || group) {
      url += `page=${page}&group=${group}`;
    }
    return fetch(url).then((response) => response.json());
  }

  getWordDescription(id: string) {
    const url = `https://rslang-team96.herokuapp.com/words/${id}`;
    return fetch(url).then((response) => response.json());
  }
}

export default Words;
