import { IWord } from '../shared/interfaces';
import {
  User,
  UserParams,
  SignInResponse,
  UserWord,
  UserWordParams,
  AggregatedWordsParams,
  AggregatedWordsResponse,
  UserStatistics,
  UserStatisticsParams,
  UserSettings,
  UserSettingsParams,
} from '../shared/types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface AxiosRequestConfigExt extends AxiosRequestConfig {
  _retry?: boolean;
  headers: Record<string, string>;
}

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
    this.axiosInstance = axios.create();
    this.axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const originalConfig: AxiosRequestConfigExt = err.config;
        if (err.response) {
          if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            const userId = this.getLocalUserId();
            const response = await this.getNewTokens(userId);
            const newToken = response && typeof response != 'string' ? response.token : '';
            originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
            return this.axiosInstance(originalConfig);
          }
        }
        return err.response;
      }
    );
  }

  async getWords(group: number, page: number): Promise<IWord[] | string | void> {
    const response = await fetch(`${this.wordsEndpoint}?group=${group}&page=${page}`);
    return this.handleResponse(response);
  }

  async getWord(wordId: string): Promise<IWord | string | void> {
    const response = await fetch(`${this.wordsEndpoint}/${wordId}`);
    return this.handleResponse(response);
  }

  async createUser(body: User): Promise<User | string | void> {
    const response = await fetch(`${this.usersEndpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response) {
      switch (response.status) {
        case 200:
          return response.json();
        case 417:
          return 'Пользователь уже существует.';
        case 422:
          return 'Не верный e-mail или пароль.';
      }
    }
  }

  async signIn(body: UserParams): Promise<SignInResponse | string | void> {
    const response = await fetch(`${this.signinEndpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response) {
      switch (response.status) {
        case 200:
          return this.saveUser(response);
        case 403:
          return 'Не верный e-mail или пароль.';
        case 404:
          return 'Пользователь не найден. Необходимо зарегистрироваться.';
      }
    }
  }

  async getUser(userId: string): Promise<User | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async updateUser(userId: string, body: UserParams): Promise<User | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.put(`${this.usersEndpoint}/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleAxiosResponse(response);
  }

  async deleteUser(userId: string): Promise<string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.delete(`${this.usersEndpoint}/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleAxiosResponse(response);
  }

  async getNewTokens(userId: string): Promise<SignInResponse | string | void> {
    const token = this.getLocalRefreshToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/tokens`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      switch (response.status) {
        case 200:
          return this.updateLocalTokens(response);
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
      }
    }
  }

  async addUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.post(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleAxiosResponse(response);
  }

  async getUserWords(userId: string): Promise<UserWord[] | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/words`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async getUserWordByID(userId: string, wordId: string): Promise<UserWord | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async updateUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.put(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleAxiosResponse(response);
  }

  async deleteUserWord(userId: string, wordId: string): Promise<string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.delete(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async getAggregatedWords(
    userId: string,
    wordsParams?: AggregatedWordsParams
  ): Promise<AggregatedWordsResponse[] | string | void> {
    const token = this.getLocalToken();
    const query = wordsParams ? this.createAggregatedWordsQuery(wordsParams) : '';
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/aggregatedWords${query}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async getAggregatedWordsById(userId: string, wordId: string): Promise<UserWord[] | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/aggregatedWords/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async getUserStatistics(userId: string): Promise<UserStatistics | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/statistics`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async upsertUserStatistics(userId: string, body: UserStatisticsParams): Promise<UserStatistics | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.put(`${this.usersEndpoint}/${userId}/statistics`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleAxiosResponse(response);
  }

  async getUserSettings(userId: string): Promise<UserSettings | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.get(`${this.usersEndpoint}/${userId}/settings`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleAxiosResponse(response);
  }

  async upsertUserSettings(userId: string, body: UserSettingsParams): Promise<UserSettings | string | void> {
    const token = this.getLocalToken();
    const response = await this.axiosInstance.put(`${this.usersEndpoint}/${userId}/settings`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleAxiosResponse(response);
  }

  private handleResponse(response: Response) {
    if (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.statusText;
      }
    }
  }

  private handleAxiosResponse(response: AxiosResponse) {
    if (response) {
      if (response.status === 200) {
        return response.data;
      } else {
        return response.statusText;
      }
    }
  }

  private async saveUser(rawResponse: Response) {
    const response: SignInResponse = await rawResponse.json();
    const user = JSON.stringify(response);
    localStorage.setItem('user', user);
    return response;
  }

  private async updateLocalTokens(rawResponse: Response) {
    const response: SignInResponse = await rawResponse.json();
    let userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    if (userObj) {
      userObj.token = response.token;
      userObj.refreshToken = response.refreshToken;
    }
    userStr = JSON.stringify(userObj);
    localStorage.setItem('user', userStr);
    return response;
  }

  private getLocalToken(): string {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    const token = userObj ? userObj.token : '';
    return token;
  }

  private getLocalRefreshToken() {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    const refreshToken = userObj ? userObj.refreshToken : '';
    return refreshToken;
  }

  private getLocalUserId() {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    const userId = userObj ? userObj.userId : '';
    return userId;
  }

  private createAggregatedWordsQuery(wordsParams: AggregatedWordsParams) {
    const query: string[] = [];
    if (wordsParams.group) query.push(`group=${wordsParams.group}`);
    if (wordsParams.page) query.push(`page=${wordsParams.group}`);
    if (wordsParams.wordsPerPage) query.push(`wordsPerPage=${wordsParams.wordsPerPage}`);
    if (wordsParams.filter) query.push(`filter=${wordsParams.filter}`);
    return `?${query.join('&')}`;
  }
}

export default API;
