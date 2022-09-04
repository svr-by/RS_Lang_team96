import { UserWordParams } from '../types';

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

export interface IAggregatedWord extends IWord {
  userWord?: UserWordParams;
  _id: string;
}

export interface IStorage {
  countAnswerCorrect: number;
  namesAnswerCorrect: string[];
  namesAnswerCorrectTranslate: string[];
  namesAnswerCorrectSound: string[];
  inRow: number;
  setInRow: Set<number>;
  countAnswerWrong: number;
  namesAnswerWrong: string[];
  namesAnswerWrongTranslate: string[];
  namesAnswerWrongSound: string[];
  score: number;
  newWords: number;
}

export interface IStatByGames {
  allGamesRightPercent: number;
  allGamesRight: number;
  allGamesWrong: number;
  allNewWords: number;
  date: string;
  games: {
    audioCall: {
      rightPercent: number;
      right: number;
      wrong: number;
      bestSeries: number;
      newWords: number;
    };
    sprint: {
      rightPercent: number;
      right: number;
      wrong: number;
      bestSeries: number;
      newWords: number;
    };
  };
}

export interface IStatByGames {
  allGamesRightPercent: number;
  allGamesRight: number;
  allGamesWrong: number;
  allNewWords: number;
  date: string;
  games: {
    audioCall: {
      rightPercent: number;
      right: number;
      wrong: number;
      bestSeries: number;
      newWords: number;
    };
    sprint: {
      rightPercent: number;
      right: number;
      wrong: number;
      bestSeries: number;
      newWords: number;
    };
  };
}
