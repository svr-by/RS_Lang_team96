import getData from '../../../api/get-data';
import IWord from '../../../shared/interfaces/word';

export default async function getWords(group: string, page: string): Promise<IWord[]> {
  const data = await getData(`words?group=${group}&page=${page}`);
  return data;
}
