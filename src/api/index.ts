import { Word } from '../types/index';

class API {
  base = 'http://localhost:3000';
  wordsEndpoint = `${this.base}/words`;
  usersEndpoint = `${this.base}/users`;
  signinEndpoint = `${this.base}/signin`;

  async getWords(group: number, page: number): Promise<Word[]> {
    const response = await fetch(`${this.wordsEndpoint}?group=${group}&page=${page}`);
    return response.json();
  }

  async getWord(wordId: string): Promise<Word> {
    const response = await fetch(`${this.wordsEndpoint}/${wordId}`);
    return response.json();
  }
}

export default API;
