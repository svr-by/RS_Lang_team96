import { storageService } from '../shared/services/storageService';
import { SignInResponse } from '../shared/types';
import { userService } from '../shared/services/userService';
import axios, { AxiosError, AxiosInstance } from 'axios';

class API {
  base: string;
  wordsEndpoint: string;
  usersEndpoint: string;
  signinEndpoint: string;
  axiosInstance: AxiosInstance;

  constructor() {
    this.base = 'https://rslang-team96.herokuapp.com';
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
      (err: AxiosError) => {
        if (err.message === 'Network Error') {
          userService.showServerDownMess();
        } else if (err?.response?.status === 401) {
          userService.showAuthorizationMess();
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
}

export const api = new API();
