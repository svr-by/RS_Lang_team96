import {
  Word,
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
} from 'src/types/index';

class API {
  base = 'http://localhost:8000';
  wordsEndpoint = `${this.base}/words`;
  usersEndpoint = `${this.base}/users`;
  signinEndpoint = `${this.base}/signin`;

  async getWords(group: number, page: number): Promise<Word[] | string | void> {
    const response = await fetch(`${this.wordsEndpoint}?group=${group}&page=${page}`);
    return this.handleResponse(response);
  }

  async getWord(wordId: string): Promise<Word | string | void> {
    const response = await fetch(`${this.wordsEndpoint}/${wordId}`);
    return this.handleResponse(response);
  }

  async createUser(body: User): Promise<User | string | void> {
    const response = await fetch(`${this.usersEndpoint}`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
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
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getUser(userId: string): Promise<User | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async updateUser(userId: string, body: UserParams): Promise<User | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      method: 'PUT',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
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
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async getNewTokens(userId: string): Promise<SignInResponse | string | void> {
    const token = this.getRefreshToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/tokens`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        /*eslint-enable */
      },
    });
    if (response) {
      switch (response.status) {
        case 200:
          return this.saveTokens(response);
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
        default:
          break;
      }
    }
  }

  async addUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getUserWords(userId: string): Promise<UserWord[] | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async getUserWordByID(userId: string, wordId: string): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async updateUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
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
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
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
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async getAggregatedWordsById(userId: string, wordId: string): Promise<UserWord[] | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/aggregatedWords/${wordId}`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async getUserStatistics(userId: string): Promise<UserStatistics | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/statistics`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async upsertUserStatistics(userId: string, body: UserStatisticsParams): Promise<UserStatistics | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getUserSettings(userId: string): Promise<UserSettings | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/settings`, {
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return this.handleResponse(response);
  }

  async upsertUserSettings(userId: string, body: UserSettingsParams): Promise<UserSettings | string | void> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/settings`, {
      method: 'PUT',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
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
        default:
          break;
      }
    }
  }

  private async saveTokens(rawResponse: Response) {
    const response: SignInResponse = await rawResponse.json();
    const token = response.token;
    localStorage.setItem('token', token);
    const refreshToken = response.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    return response;
  }

  private getToken() {
    return localStorage.getItem('token');
  }

  private getRefreshToken() {
    return localStorage.getItem('refreshToken');
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
