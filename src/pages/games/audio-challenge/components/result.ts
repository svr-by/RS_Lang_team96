import BaseComponent from '../../../../shared/components/base_component';
import StatWordsWrong from './result-wrong';
import StatWordsAnswer from './result-answer';
import { IStorage } from '../../../../shared/interfaces';
import StatisticStorage from '../../../games/utility/statistics-storage';
// import { statisticApiService } from '../../../../api/statisticApiService';
import { storageService } from '../../../../shared/services/storageService';
// import { userService } from '../../../../shared/services/userService';

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
      `<span clas = 'result__num'>${Math.round((this.storage.countAnswerCorrect / 20) * 100)}</span> %`
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

    // const userID: string | null = userService.getStoredUserId();
    // if (userID) {
    //   let userData = await statisticApiService.getUserStatistics(userID);
    //   if (typeof userData !== 'boolean') {
    //     userData = await statisticApiService.getUserStatistics(userID);
    //     if (userData) {
    //       userData.learnedWords += this.storage.countAnswerCorrect;
    //       userData.optional.AudioCountAnswerCorrect += this.storage.countAnswerCorrect;
    //       userData.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
    //       if (this.storage.setInRow.size > userData.optional.AudioInRow) {
    //         userData.optional.AudioInRow = this.storage.setInRow.size;
    //       }
    //     }
    //     const storage: IStatistic = {
    //       learnedWords: userData.learnedWords,
    //       optional: {
    //         AudioCountAnswerCorrect: userData.optional.AudioCountAnswerCorrect,
    //         AudioCountAnswerWrong: userData.optional.AudioCountAnswerWrong,
    //         AudioInRow: userData.optional.AudioInRow,
    //         SprintCountAnswerCorrect: userData.optional.SprintCountAnswerCorrect,
    //         SprintCountAnswerWrong: userData.optional.SprintCountAnswerWrong,
    //         SprintInRow: userData.optional.SprintInRow,
    //         SprintScore: userData.optional.SprintScore,
    //       },
    //     };
    //     await statisticApiService.saveUserStatistics(userID, storage);
    //   } else {
    //     const storage: IStatistic = {
    //       learnedWords: 0,
    //       optional: {
    //         AudioCountAnswerCorrect: 0,
    //         AudioCountAnswerWrong: 0,
    //         AudioInRow: 0,
    //         SprintCountAnswerCorrect: 0,
    //         SprintCountAnswerWrong: 0,
    //         SprintInRow: 0,
    //         SprintScore: 0,
    //       },
    //     };
    //     await statisticApiService.saveUserStatistics(userID, storage);
    //     userData = (await statisticApiService.getUserStatistics(userID)) as IStatistic;
    //     userData.learnedWords += this.storage.countAnswerCorrect;
    //     userData.optional.AudioCountAnswerCorrect += this.storage.countAnswerCorrect;
    //     userData.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
    //     if (this.storage.setInRow.size > userData.optional.AudioInRow) {
    //       userData.optional.AudioInRow = this.storage.setInRow.size;
    //     }
    //     await statisticApiService.saveUserStatistics(userID, userData);
    //   }
    // } else {
    StatisticStorage.learnedWords += this.storage.countAnswerCorrect;
    StatisticStorage.optional.AudioCountAnswerCorrect += this.storage.countAnswerCorrect;
    StatisticStorage.optional.AudioCountAnswerWrong += this.storage.countAnswerWrong;
    if (this.storage.setInRow.size > StatisticStorage.optional.AudioInRow) {
      StatisticStorage.optional.AudioInRow = this.storage.setInRow.size;
    }
    storageService.setSession('StatisticStorage', StatisticStorage);
    // }
  }
}
