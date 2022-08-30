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
}

export interface IOptionalStat {
  AudioCountAnswerCorrect: number;
  AudioCountAnswerWrong: number;
  AudioInRow: number;
  SprintCountAnswerCorrect: number;
  SprintCountAnswerWrong: number;
  SprintInRow: number;
}

export interface IStatistic {
  learnedWords: number;
  optional: IOptionalStat;
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
}
