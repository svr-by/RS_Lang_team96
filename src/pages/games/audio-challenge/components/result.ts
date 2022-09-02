import BaseComponent from '../../../../shared/components/base_component';
import StatWordsWrong from './result-wrong';
import StatWordsAnswer from './result-answer';
import StatisticStorage from '../../../games/utility/statistics-storage';
import { IStorage } from '../../../../shared/interfaces';
import { statisticApiService } from '../../../../api/statisticApiService';
import { storageService } from '../../../../shared/services/storageService';
import { userService } from '../../../../shared/services/userService';
import { dateToday } from '../../../../shared/services/dateService';

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

    StatisticStorage.learnedWords = 20;
    StatisticStorage.optional.AudioCountAnswerCorrect = this.storage.countAnswerCorrect;
    StatisticStorage.optional.AudioCountAnswerWrong = this.storage.countAnswerWrong;
    if (this.storage.setInRow.size > StatisticStorage.optional.AudioInRow) {
      StatisticStorage.optional.AudioInRow = this.storage.setInRow.size;
    }
    storageService.setSession('StatisticStorage', StatisticStorage);

    const userId = userService.getStoredUserId();
    if (userId) {

      storageService.getSession('StatisticStorage');

      const userStat = await statisticApiService.getUserStatistics(userId);
      if (userStat && userStat.optional) {
        const LSData = {
          allGamesRightPercent: 100,
          allGamesRight: 20,
          allGamesWrong: 10,
          allNewWords: userStat.optional[dateToday],
          date: dateToday,
          games: {
            audioCall: {
              rightPercent: 0,
              right: 0,
              wrong: 0,
              bestSeries: this.storage.setInRow.size,
              newWords: 0,
            },
            sprint: {
              rightPercent: 0,
              right: 0,
              wrong: 0,
              bestSeries: 0,
              newWords: 0,
            },
          },
        }
        storageService.setSession('StatByGames', LSData);
      }
    }
  }
}
