import IWord from '../../../interfaces/word';

export default async function getData(path = ''): Promise<IWord[]> {
  const url = `http://localhost:8000/${path}`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
}
