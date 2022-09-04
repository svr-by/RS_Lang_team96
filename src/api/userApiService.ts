import { User, UserParams, SignInResponse } from '../shared/types';
import { AxiosError, AxiosResponse } from 'axios';
import { storageService } from '../shared/services/storageService';
import { api } from './api';

class UserApiService {
  async createUser(body: User): Promise<User | string | undefined> {
    const response = await api.axiosInstance.post(`${api.usersEndpoint}`, body).catch((error: AxiosError) => {
      switch (error.response?.status) {
        case 417:
          return 'Пользователь уже существует.';
        case 422:
          return 'Не верный e-mail или пароль.';
        default:
          return 'Извините, непредвиденная ошибка.';
      }
    });

    if (response && typeof response === 'string') {
      return response;
    } else if (response) {
      return response.data;
    }
  }

  async signIn(body: UserParams): Promise<SignInResponse | string | undefined> {
    const response = await api.axiosInstance.post(`${api.signinEndpoint}`, body).catch((error: AxiosError) => {
      switch (error.response?.status) {
        case 403:
          return 'Не верный e-mail или пароль.';
        case 404:
          return 'Пользователь не найден. Необходимо зарегистрироваться.';
        default:
          return 'Извините, непредвиденная ошибка.';
      }
    });

    if (response && typeof response === 'string') {
      return response;
    } else if (response) {
      return this.saveUser(response);
    }
  }

  async getUser(userId: string): Promise<User | undefined> {
    const response = await api.axiosInstance.get(`${api.usersEndpoint}/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, body: UserParams): Promise<User | undefined> {
    const response = await api.axiosInstance.put(`${api.usersEndpoint}/${userId}`, body);
    return response.data;
  }

  async deleteUser(userId: string): Promise<string | undefined> {
    const response = await api.axiosInstance.delete(`${api.usersEndpoint}/${userId}`);
    return response.data;
  }

  private async saveUser(rawResponse: AxiosResponse) {
    const user: SignInResponse = await rawResponse.data;
    storageService.setLocal<SignInResponse>('user', user);
    return user;
  }
}

export const userApiService = new UserApiService();
