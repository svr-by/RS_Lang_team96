import IStatistic from '../shared/interfaces/statistic';

export default async function saveUserStatistics(id: string, token: string, storage: IStatistic) {
  const url = `http://localhost:8000/users/${id}/statistics`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storage),
  });

  const answer: IStatistic = await response.json();
  return answer;
}
