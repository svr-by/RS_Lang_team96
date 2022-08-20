export interface Word {
  id: string;
  group: 0;
  page: 0;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export type User = {
  name: string;
  email: string;
  password: string;
};

export type UserParams = Pick<User, 'email' | 'password'>;

export type SignInResponse = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

export type UserWord = {
  difficulty: string;
  id: string;
  wordId: string;
  optional?: Record<string, unknown>;
};

export type UserWordParams = Pick<UserWord, 'difficulty' | 'optional'>;

export interface AggregatedWord extends Word {
  userWord?: UserWordParams;
}

export type AggregatedWordsParams = {
  group?: number;
  page?: number;
  wordsPerPage?: number;
  filter?: string;
};

export type AggregatedWordsResponse = {
  paginatedResults: AggregatedWord[];
  totalCount: [{ count: number }];
};
