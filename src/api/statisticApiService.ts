import { IStatistic } from '../shared/interfaces';
import { api } from './api';

class StatisticApiService {
  async getUserStatistics(userId: string): Promise<IStatistic | void> {
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}/statistics`);
    return response.data;
  }

  async saveUserStatistics(userId: string, stats: IStatistic) {
    const response = await api.axiosInstance.put(`${api.usersEndpoint}/${userId}/statistics`, stats);
    return response.data;
  }
}

export const statisticApiService = new StatisticApiService();
