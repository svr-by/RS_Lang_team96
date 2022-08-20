import {
  Word,
  User,
  UserParams,
  SignInResponse,
  UserWord,
  UserWordParams,
  AggregatedWordsParams,
  AggregatedWordsResponse,
} from '../types/index';

class API {
  base = 'http://localhost:3000';
  wordsEndpoint = `${this.base}/words`;
  usersEndpoint = `${this.base}/users`;
  signinEndpoint = `${this.base}/signin`;

  async getWords(group: number, page: number): Promise<Word[]> {
    const response = await fetch(`${this.wordsEndpoint}?group=${group}&page=${page}`);
    return response.json();
  }

  async getWord(wordId: string): Promise<Word> {
    const response = await fetch(`${this.wordsEndpoint}/${wordId}`);
    return response.json();
  }

  async createUser(body: User): Promise<User | string> {
    const response = await fetch(`${this.usersEndpoint}`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.ok ? response.json() : response.text();
  }

  async signIn(body: UserParams): Promise<SignInResponse | string> {
    const response = await fetch(`${this.signinEndpoint}`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.ok ? this.saveTokens(response) : response.text();
  }

  async getUser(userId: string): Promise<User | string> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return response.ok ? response.json() : response.text();
  }

  async updateUser(userId: string, body: UserParams): Promise<User | string> {
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
    return response.ok ? response.json() : response.text();
  }

  async deleteUser(userId: string): Promise<string> {
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
    return response.ok ? 'The user has been deleted' : response.text();
  }

  async getNewTokens(userId: string): Promise<SignInResponse | string> {
    const token = this.getRefreshToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/tokens`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        /*eslint-enable */
      },
    });
    return response.ok ? this.saveTokens(response) : response.text();
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

  async addUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string> {
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
    return response.ok ? response.json() : response.text();
  }

  async getUserWords(userId: string): Promise<UserWord[] | string> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return response.ok ? response.json() : response.text();
  }

  async getUserWordByID(userId: string, wordId: string): Promise<UserWord | string> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return response.ok ? response.json() : response.text();
  }

  async updateUserWord(userId: string, wordId: string, body: UserWordParams): Promise<UserWord | string> {
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
    return response.ok ? response.json() : response.text();
  }

  async deleteUserWord(userId: string, wordId: string): Promise<UserWord | string> {
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
    return response.ok ? 'The user word has been deleted' : response.text();
  }

  async getAggregatedWords(
    userId: string,
    wordsParams?: AggregatedWordsParams
  ): Promise<AggregatedWordsResponse[] | string> {
    const token = this.getToken();
    const query = wordsParams ? this.createAggregatedWordsQuery(wordsParams) : '';
    const response = await fetch(`${this.usersEndpoint}/${userId}/aggregatedWords${query}`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return response.ok ? response.json() : response.text();
  }

  private createAggregatedWordsQuery(wordsParams: AggregatedWordsParams) {
    const query: string[] = [];
    if (wordsParams.group) query.push(`group=${wordsParams.group}`);
    if (wordsParams.page) query.push(`page=${wordsParams.group}`);
    if (wordsParams.wordsPerPage) query.push(`wordsPerPage=${wordsParams.wordsPerPage}`);
    if (wordsParams.filter) query.push(`filter=${wordsParams.filter}`);
    return `?${query.join('&')}`;
  }

  async getAggregatedWordsById(userId: string, wordId: string): Promise<UserWord[] | string> {
    const token = this.getToken();
    const response = await fetch(`${this.usersEndpoint}/${userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        /*eslint-disable */
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        /*eslint-enable */
      },
    });
    return response.ok ? response.json() : response.text();
  }
}

export default API;
