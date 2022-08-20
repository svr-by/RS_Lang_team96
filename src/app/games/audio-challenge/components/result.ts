import BaseComponent from '../../base-сomponent';
import StatWordsWrong from './result-wrong';
import StatWordsAnswer from './result-answer';
import IStorage from '../../../interfaces/audio-challenge-storage';
import IStatistic from '../../../interfaces/statistic';
import StatisticStorage from '../../statistics/statistics-storage';
import saveUserStatistics from '../../../request/put-statistics';
import getUserStatistics from '../../../request/get-statistics';

export default class Result {
  readonly result: HTMLElement;

  readonly container: HTMLElement;

  readonly statisticBox: HTMLElement;

  constructor(private readonly root: HTMLElement, public storage: IStorage) {
    this.result = document.createElement('div');
    this.container = document.createElement('div');
    this.statisticBox = document.createElement('div');
  }

  async render() {
    this.root.appendChild(this.result);
    this.result.classList.add('result');

    new BaseComponent(this.result, 'h2', ['result__title'], 'Result').render();

    this.result.appendChild(this.container);
    this.container.classList.add('result__container');

    this.container.appendChild(this.statisticBox);
    this.statisticBox.classList.add('result__statistic-box');
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__accuracy'],
      '<span clas = "result__num">Accuracy</span>'
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__accuracyNum'],
      `<span clas = 'result__num'>${Math.round((this.storage.countAnswerСorrect / 20) * 100)}</span> %`
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__correct'],
      `<span clas = 'result__num'>${this.storage.countAnswerСorrect}</span> - Right answers`
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__in-row'],
      `<span clas = 'result__num'>${this.storage.setInRow.size}</span> - In a row`
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__wrong'],
      `<span clas = 'result__num'>${this.storage.countAnswerWrong}</span> - Mistakes`
    ).render();

    new StatWordsAnswer(this.container, this.storage).render();
    new StatWordsWrong(this.container, this.storage).render();

    const userToken: string | null = localStorage.getItem('token');
    const userID: string | null = localStorage.getItem('id');
    if (userToken && userID) {
      let userData = await getUserStatistics(userID, userToken);
      if (typeof userData !== 'boolean') {
        userData = (await getUserStatistics(userID, userToken)) as IStatistic;
        userData.learnedWords += this.storage.countAnswerСorrect;
        userData.optional.AudioCountAnswerСorrect += this.storage.countAnswerСorrect;
        userData.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
        if (this.storage.setInRow.size > userData.optional.AudioInRow) {
          userData.optional.AudioInRow = this.storage.setInRow.size;
        }
        const storage: IStatistic = {
          learnedWords: userData.learnedWords,
          optional: {
            AudioCountAnswerСorrect: userData.optional.AudioCountAnswerСorrect,
            AudioCountAnswerWrong: userData.optional.AudioCountAnswerWrong,
            AudioInRow: userData.optional.AudioInRow,
            SprintCountAnswerСorrect: userData.optional.SprintCountAnswerСorrect,
            SprintCountAnswerWrong: userData.optional.SprintCountAnswerWrong,
            SprintInRow: userData.optional.SprintInRow,
          },
        };
        await saveUserStatistics(userID, userToken, storage);
      } else {
        const storage: IStatistic = {
          learnedWords: 0,
          optional: {
            AudioCountAnswerСorrect: 0,
            AudioCountAnswerWrong: 0,
            AudioInRow: 0,
            SprintCountAnswerСorrect: 0,
            SprintCountAnswerWrong: 0,
            SprintInRow: 0,
          },
        };
        await saveUserStatistics(userID, userToken, storage);
        userData = (await getUserStatistics(userID, userToken)) as IStatistic;
        userData.learnedWords += this.storage.countAnswerСorrect;
        userData.optional.AudioCountAnswerСorrect += this.storage.countAnswerСorrect;
        userData.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
        if (this.storage.setInRow.size > userData.optional.AudioInRow) {
          userData.optional.AudioInRow = this.storage.setInRow.size;
        }
        await saveUserStatistics(userID, userToken, userData);
      }
    } else {
      StatisticStorage.learnedWords += this.storage.countAnswerСorrect;
      StatisticStorage.optional.AudioCountAnswerСorrect += this.storage.countAnswerСorrect;
      StatisticStorage.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
      if (this.storage.setInRow.size > StatisticStorage.optional.AudioInRow) {
        StatisticStorage.optional.AudioInRow = this.storage.setInRow.size;
      }
    }
  }
}
