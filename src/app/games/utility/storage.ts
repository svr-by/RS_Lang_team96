export default interface IStorage {
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
