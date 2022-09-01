import { storageService } from '../shared/services/storageService';
import { SignInResponse } from '../shared/types';
import { userService } from '../shared/services/userService';
import { AxiosRequestConfigExt } from './interface';
import axios, { AxiosInstance } from 'axios';

class API {
  base: string;
  wordsEndpoint: string;
  usersEndpoint: string;
  signinEndpoint: string;
  axiosInstance: AxiosInstance;

  constructor() {
    this.base = 'http://localhost:8000';
    this.wordsEndpoint = `${this.base}/words`;
    this.usersEndpoint = `${this.base}/users`;
    this.signinEndpoint = `${this.base}/signin`;
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getLocalToken();
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const originalConfig: AxiosRequestConfigExt = err.config;
        if (err.response) {
          if (err.message === 'Network Error') {
            userService.showServerDownMess();
          } else if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            const userId = this.getLocalUserId();
            await this.getNewTokens(userId);
            const newToken = this.getLocalToken();
            originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
            return this.axiosInstance(originalConfig);
          } else if (err.response.status === 401 && originalConfig._retry) {
            userService.showAuthorizationMess();
          }
        }
        return err;
      }
    );
  }

  private getLocalToken(): string {
    const user = storageService.getLocal<SignInResponse>('user');
    const token = user ? user.token : '';
    return token;
  }

  private getLocalRefreshToken() {
    const user = storageService.getLocal<SignInResponse>('user');
    const refreshToken = user ? user.refreshToken : '';
    return refreshToken;
  }

  private getLocalUserId() {
    const user = storageService.getLocal<SignInResponse>('user');
    const userId = user ? user.userId : '';
    return userId;
  }

  private async getNewTokens(userId: string) {
    const refreshToken = this.getLocalRefreshToken();
    const response = await axios
      .get(`${this.usersEndpoint}/${userId}/tokens`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .catch(() => null);
    if (response) this.updateLocalTokens(response.data);
  }

  private async updateLocalTokens(data: SignInResponse) {
    const user = storageService.getLocal<SignInResponse>('user');
    if (user) {
      user.token = data.token;
      user.refreshToken = data.refreshToken;
      storageService.setLocal<SignInResponse>('user', user);
    }
  }
}

export const api = new API();
