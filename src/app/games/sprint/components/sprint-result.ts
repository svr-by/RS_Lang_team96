import BaseComponent from 'src/app/games/utility/base_component';
import StatWordsWrong from 'src/app/games/audio-challenge/components/result-wrong';
import StatWordsAnswer from 'src/app/games/audio-challenge/components/result-answer';
import IStorage from 'src/app/games/utility/storage';
import IStatistic from 'src/interfaces/statistic';
import StatisticStorage from 'src/app/games/utility/statistics-storage';
import saveUserStatistics from 'src/app/games/api/put-statistics';
import getUserStatistics from 'src/app/games/api/get-statistics';

export default class ResultSprint {
  readonly resultSprint: HTMLElement;

  readonly container: HTMLElement;

  readonly statisticBox: HTMLElement;

  constructor(private readonly root: HTMLElement, public storage: IStorage) {
    this.resultSprint = document.createElement('div');
    this.container = document.createElement('div');
    this.statisticBox = document.createElement('div');
  }

  async render() {
    this.root.appendChild(this.resultSprint);
    this.resultSprint.classList.add('result');

    new BaseComponent(this.resultSprint, 'h2', ['result__title'], 'Result').render();

    this.resultSprint.appendChild(this.container);
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
      `<span clas = 'result__num'>${
        Math.round(
          (this.storage.countAnswerCorrect / (this.storage.countAnswerCorrect + this.storage.countAnswerWrong)) * 100
        ) || '0'
      }</span> %`
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__correct'],
      `<span clas = 'result__num'>${this.storage.countAnswerCorrect}</span> - Right answers`
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
        userData.learnedWords += this.storage.countAnswerCorrect;
        userData.optional.SprintCountAnswerCorrect += this.storage.countAnswerCorrect;
        userData.optional.SprintCountAnswerWrong += this.storage.countAnswerWrong;
        if (this.storage.setInRow.size > userData.optional.SprintInRow) {
          userData.optional.SprintInRow = this.storage.setInRow.size;
        }
        const storage: IStatistic = {
          learnedWords: userData.learnedWords,
          optional: {
            AudioCountAnswerCorrect: userData.optional.AudioCountAnswerCorrect,
            AudioCountAnswerWrong: userData.optional.AudioCountAnswerWrong,
            AudioInRow: userData.optional.AudioInRow,
            SprintCountAnswerCorrect: userData.optional.SprintCountAnswerCorrect,
            SprintCountAnswerWrong: userData.optional.SprintCountAnswerWrong,
            SprintInRow: userData.optional.SprintInRow,
          },
        };
        await saveUserStatistics(userID, userToken, storage);
      } else {
        const storage: IStatistic = {
          learnedWords: 0,
          optional: {
            AudioCountAnswerCorrect: 0,
            AudioCountAnswerWrong: 0,
            AudioInRow: 0,
            SprintCountAnswerCorrect: 0,
            SprintCountAnswerWrong: 0,
            SprintInRow: 0,
          },
        };
        await saveUserStatistics(userID, userToken, storage);
        userData = (await getUserStatistics(userID, userToken)) as IStatistic;
        userData.learnedWords += this.storage.countAnswerCorrect;
        userData.optional.SprintCountAnswerCorrect += this.storage.countAnswerCorrect;
        userData.optional.SprintCountAnswerWrong += this.storage.countAnswerWrong;
        if (this.storage.setInRow.size > userData.optional.SprintInRow) {
          userData.optional.SprintInRow = this.storage.setInRow.size;
        }
        await saveUserStatistics(userID, userToken, userData);
      }
    } else {
      StatisticStorage.learnedWords += this.storage.countAnswerCorrect;
      StatisticStorage.optional.SprintCountAnswerCorrect += this.storage.countAnswerCorrect;
      StatisticStorage.optional.SprintCountAnswerWrong += this.storage.countAnswerWrong;
      if (this.storage.setInRow.size > StatisticStorage.optional.SprintInRow) {
        StatisticStorage.optional.SprintInRow = this.storage.setInRow.size;
      }
    }

    StatisticStorage.learnedWords += this.storage.countAnswerCorrect;
    StatisticStorage.optional.SprintCountAnswerCorrect += this.storage.countAnswerCorrect;
    StatisticStorage.optional.SprintCountAnswerWrong += this.storage.countAnswerWrong;
    if (this.storage.setInRow.size > StatisticStorage.optional.SprintInRow) {
      StatisticStorage.optional.SprintInRow = this.storage.setInRow.size;
    }
  }
}
