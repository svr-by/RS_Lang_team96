import { IAggregatedWord } from '../interfaces';

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
  id: string;
  wordId: string;
  difficulty: string;
  optional?: {
    games: {
      audioCall: {
        right: number;
        wrong: number;
      };
      sprint: {
        right: number;
        wrong: number;
      };
    };
  };
};

export type UserWordParams = Pick<UserWord, 'difficulty' | 'optional'>;

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
  id?: string;
  learnedWords: number;
  optional?: UserStatisticsOptions;
};

export type UserStatisticsOptions = {
  [index: string]: number;
};

export type UserStatisticsPerDay = {
  date: string;
  counterNewWords: number;
};

export type UserStatisticsParams = Pick<UserStatistics, 'learnedWords' | 'optional'>;

export type UserSettings = {
  id: string;
  wordsPerDay: number;
  optional?: Record<string, unknown>;
};

export type UserSettingsParams = Pick<UserSettings, 'wordsPerDay' | 'optional'>;

export type NewElement = {
  tag: string;
  text?: string;
  classes?: string[];
  id?: string;
};

export type LevelType = {
  name: string;
  numbers: string;
  id: string;
};
