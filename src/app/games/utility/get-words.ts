import getData from 'src/app/games/api/get-data';
import IWord from 'src/interfaces/word';

export default async function getWords(group: string, page: string): Promise<IWord[]> {
  const data = await getData(`words?group=${group}&page=${page}`);
  return data;
}
