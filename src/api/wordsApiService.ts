import { UserWordParams, UserWord, AggregatedWordsParams, AggregatedWordsResponse } from '../shared/types';
import { api } from './api';
import { IWord } from '../shared/interfaces';

class WordsApiService {
  async getWords(group: number, page: number): Promise<IWord[] | undefined> {
    const response = await api.axiosInstance.get(`${api.wordsEndpoint}?group=${group}&page=${page}`);
    return response.data;
  }

  async getWord(wordId: string): Promise<IWord | undefined> {
    const response = await api.axiosInstance.get(`${api.wordsEndpoint}/${wordId}`);
    return response.data;
  }

  async addUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | undefined> {
    const response = await api.axiosInstance.post(`${api.usersEndpoint}/${userId}/words/${wordId}`, body);
    return response.data;
  }

  async getUserWords(userId: string): Promise<UserWord[] | undefined> {
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}/words`);
    return response.data;
  }

  async getUserWordByID(userId: string, wordId: string): Promise<UserWord | undefined> {
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}/words/${wordId}`);
    return response.data;
  }

  async updateUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | undefined> {
    const response = await api.axiosInstance.put(`${api.usersEndpoint}/${userId}/words/${wordId}`, body);
    return response.data;
  }

  async deleteUserWord(userId: string, wordId: string): Promise<string | undefined> {
    const response = await api.axiosInstance.delete(`${api.usersEndpoint}/${userId}/words/${wordId}`);
    return response.data;
  }

  async getAggregatedWords(
    userId: string,
    wordsParams?: AggregatedWordsParams
  ): Promise<AggregatedWordsResponse[] | undefined> {
    const query = wordsParams ? this.createAggregatedWordsQuery(wordsParams) : '';
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}/aggregatedWords${query}`);
    return response.data;
  }

  async getAggregatedUserWords(
    userId: string,
    page: number,
    group: number,
    wordsPerPage: number
  ): Promise<AggregatedWordsResponse[] | undefined> {
    const targetPage = `{"$and":[{"page":${page}},{"group":${group}}]}`;
    return this.getAggregatedWords(userId, { wordsPerPage: wordsPerPage, filter: targetPage });
  }

  async getUserHardWords(userId: string): Promise<AggregatedWordsResponse[] | undefined> {
    const targetPage = `{"userWord.difficulty":"hard"}`;
    return this.getAggregatedWords(userId, { filter: targetPage });
  }

  async getUserLearnedWords(userId: string): Promise<AggregatedWordsResponse[] | undefined> {
    const targetPage = `{"userWord.difficulty":"learned"}`;
    return this.getAggregatedWords(userId, { filter: targetPage });
  }

  async getAggregatedWordsById(userId: string, wordId: string): Promise<UserWord[] | undefined> {
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}/aggregatedWords/${wordId}`);
    return response.data;
  }

  private createAggregatedWordsQuery(wordsParams: AggregatedWordsParams) {
    const { group, page, wordsPerPage, filter } = wordsParams;
    const query: string[] = [];
    if (group !== undefined) query.push(`group=${group}`);
    if (page !== undefined) query.push(`page=${page}`);
    if (wordsPerPage !== undefined) query.push(`wordsPerPage=${wordsPerPage}`);
    if (filter !== undefined) query.push(`filter=${filter}`);
    return `?${query.join('&')}`;
  }
}

export const wordsApiService = new WordsApiService();
