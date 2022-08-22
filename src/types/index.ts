export interface IWord {
  id: string;
  group: number;
  page: number;
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

export interface IAggregatedWord extends IWord {
  userWord?: UserWordParams;
}

export type AggregatedWordsParams = {
  group?: number;
  page?: number;
  wordsPerPage?: number;
  filter?: string;
};

export type AggregatedWordsResponse = {
  paginatedResults: IAggregatedWord[];
  totalCount: [{ count: number }];
};

export type UserStatistics = {
  id: string;
  learnedWords: number;
  optional?: Record<string, unknown>;
};

export type UserStatisticsParams = Pick<UserStatistics, 'learnedWords' | 'optional'>;

export type UserSettings = {
  id: string;
  wordsPerDay: number;
  optional?: Record<string, unknown>;
};

export type UserSettingsParams = Pick<UserSettings, 'wordsPerDay' | 'optional'>;
