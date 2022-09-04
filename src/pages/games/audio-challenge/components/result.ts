import BaseComponent from '../../../../shared/components/base_component';
import { Modal } from '../../../../shared/components/modal';
import StatWordsWrong from './result-wrong';
import StatWordsAnswer from './result-answer';
import { IStorage, IStatByGames } from '../../../../shared/interfaces';
import { storageService } from '../../../../shared/services/storageService';
import { userService } from '../../../../shared/services/userService';
import { dateToday } from '../../../../shared/services/dateService';

export default class Result {
  result: HTMLElement;
  container: HTMLElement;
  statisticBox: HTMLElement;

  constructor(public storage: IStorage) {
    this.result = document.createElement('div');
    this.container = document.createElement('div');
    this.statisticBox = document.createElement('div');
  }

  render() {
    this.result.classList.add('result');

    new BaseComponent(this.result, 'h2', ['result__title'], 'Результаты').render();

    this.result.appendChild(this.container);
    this.container.classList.add('result__container');

    this.container.appendChild(this.statisticBox);
    this.statisticBox.classList.add('result__statistic-box');
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__accuracy'],
      '<span clas = "result__num">Точность: </span>'
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__accuracyNum'],
      `<span clas = 'result__num'>${Math.round((this.storage.countAnswerCorrect / 20) * 100)}</span> %, `
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__correct'],
      `<span clas = 'result__num'>${this.storage.countAnswerCorrect}</span> - правильных ответов, `
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__in-row'],
      `<span clas = 'result__num'>${this.storage.setInRow.size}</span> - серия, `
    ).render();
    new BaseComponent(
      this.statisticBox,
      'div',
      ['result__wrong'],
      `<span clas = 'result__num'>${this.storage.countAnswerWrong}</span> - ошибки.`
    ).render();

    new StatWordsAnswer(this.container, this.storage).render();
    new StatWordsWrong(this.container, this.storage).render();

    const userId = userService.getStoredUserId();
    if (userId) {
      const userStatLS: IStatByGames | null = storageService.getSession('StatByGames');

      if (!userStatLS) {
        const startUserStatLS: IStatByGames = {
          allGamesRightPercent: Math.round((this.storage.countAnswerCorrect / 20) * 100),
          allGamesRight: this.storage.countAnswerCorrect,
          allGamesWrong: this.storage.countAnswerWrong,
          allNewWords: this.storage.newWords,
          date: dateToday,
          games: {
            audioCall: {
              rightPercent: (this.storage.countAnswerCorrect / 20) * 100,
              right: this.storage.countAnswerCorrect,
              wrong: this.storage.countAnswerWrong,
              bestSeries: this.storage.setInRow.size,
              newWords: this.storage.newWords,
            },
            sprint: {
              rightPercent: 0,
              right: 0,
              wrong: 0,
              bestSeries: 0,
              newWords: 0,
            },
          },
        };

        storageService.setSession('StatByGames', startUserStatLS);
      } else {
        userStatLS.games.audioCall.right += this.storage.countAnswerCorrect;
        userStatLS.games.audioCall.wrong += this.storage.countAnswerWrong;
        userStatLS.games.audioCall.bestSeries =
          userStatLS.games.audioCall.bestSeries < this.storage.setInRow.size
            ? this.storage.setInRow.size
            : userStatLS.games.audioCall.bestSeries;
        userStatLS.games.audioCall.newWords += this.storage.newWords;
        userStatLS.games.audioCall.rightPercent = Math.round(
          (userStatLS.games.audioCall.right / (userStatLS.games.audioCall.right + userStatLS.games.audioCall.wrong)) *
            100
        );
        userStatLS.date = dateToday;
        userStatLS.allNewWords = userStatLS.games.audioCall.newWords + userStatLS.games.sprint.newWords;
        userStatLS.allGamesWrong = userStatLS.games.audioCall.wrong + userStatLS.games.sprint.wrong;
        userStatLS.allGamesRight = userStatLS.games.audioCall.right + userStatLS.games.sprint.right;
        userStatLS.allGamesRightPercent = Math.round(
          (userStatLS.allGamesRight / (userStatLS.allGamesRight + userStatLS.allGamesWrong)) * 100
        );

        storageService.setSession('StatByGames', userStatLS);
      }
    }
    new Modal().showModal(this.result);
  }
}
