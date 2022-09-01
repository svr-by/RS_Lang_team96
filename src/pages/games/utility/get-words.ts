import { wordsApiService } from '../../../api/wordsApiService';
import { IWord } from '../../../shared/interfaces';

export default async function getWords(group: string, page: string): Promise<IWord[]> {
  // const api = new API();
  // const data = await api.getData(`words?group=${group}&page=${page}`);
  // return data;
  return wordsApiService.getWords(+group, +page) as Promise<IWord[]>;
}
