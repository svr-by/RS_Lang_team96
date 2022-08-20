export default interface IStorage {
  countAnswerСorrect: number;
  namesAnswerСorrect: string[];
  namesAnswerСorrectTranslate: string[];
  namesAnswerСorrectSound: string[];
  inRow: number;
  setInRow: Set<number>;
  countAnswerWrong: number;
  namesAnswerWrong: string[];
  namesAnswerWrongTranslate: string[];
  namesAnswerWrongSound: string[];
  score: number;
}
