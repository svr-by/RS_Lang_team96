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

class API {
  base = 'https://rslang-team96.herokuapp.com';
  wordsEndpoint = `${this.base}/words`;
  usersEndpoint = `${this.base}/users`;
  signinEndpoint = `${this.base}/signin`;

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
    return this.handleResponse(response);
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
          return 'Forbidden';
      }
    }
  }

  async getUser(userId: string): Promise<User | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async updateUser(userId: string, body: UserParams): Promise<User | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async deleteUser(userId: string): Promise<string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse(response);
  }

  async getNewTokens(userId: string): Promise<SignInResponse | string | void> {
    const token = this.getRefreshToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/tokens`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      switch (response.status) {
        case 200:
          return this.updateStoredToken(response);
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
      }
    }
  }

  async addUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getUserWords(userId: string): Promise<UserWord[] | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getUserWordByID(userId: string, wordId: string): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async updateUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async deleteUserWord(userId: string, wordId: string): Promise<string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getAggregatedWords(
    userId: string,
    wordsParams?: AggregatedWordsParams
  ): Promise<AggregatedWordsResponse[] | string | void> {
    const token = this.getToken();
    const query = wordsParams ? this.createAggregatedWordsQuery(wordsParams) : '';
    const response = await fetch(`${this.usersEndpoint}/${userId}/aggregatedWords${query}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getAggregatedWordsById(userId: string, wordId: string): Promise<UserWord[] | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/aggregatedWords/${wordId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getUserStatistics(userId: string): Promise<UserStatistics | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/statistics`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async upsertUserStatistics(userId: string, body: UserStatisticsParams): Promise<UserStatistics | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getUserSettings(userId: string): Promise<UserSettings | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/settings`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async upsertUserSettings(userId: string, body: UserSettingsParams): Promise<UserSettings | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/settings`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  private handleResponse(response: Response) {
    if (response) {
      switch (response.status) {
        case 200:
          return response.json();
        case 204:
          return 'Deleted';
        case 400:
          return 'Bad request';
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
        case 404:
          return 'Not found';
        case 422:
          return 'Incorrect e-mail or password';
      }
    }
  }

  private async saveUser(rawResponse: Response) {
    const response: SignInResponse = await rawResponse.json();
    const user = JSON.stringify(response);
    localStorage.setItem('user', user);
    return response;
  }

  private async updateStoredToken(rawResponse: Response) {
    const response: SignInResponse = await rawResponse.json();
    let userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    if (userObj) {
      userObj.token = response.token;
      userObj.refreshToken = response.refreshToken;
    }
    userStr = JSON.stringify(userObj);
    localStorage.setItem('user', userStr);
    console.log('token refreshed');
    return response;
  }

  private getToken(): string {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    const token = userObj ? userObj.token : '';
    return token;
  }

  private getRefreshToken() {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : null;
    const refreshToken = userObj ? userObj.refreshToken : '';
    return refreshToken;
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
