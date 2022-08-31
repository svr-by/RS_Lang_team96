import BaseComponent from '../../shared/components/base_component';
import { IStatistic } from '../../shared/interfaces';
import API from '../../api/';
import StatisticsBoxGames from '../../pages/statistic/components/statistics-boxGames';
import StatisticStorage from '../../pages/statistic/components/statistics-storage';

export default class Statistic {
  readonly api: API;

  readonly mainStatistics: HTMLElement;

  readonly container: HTMLElement;

  readonly containerWords: HTMLElement;

  readonly containerGames: HTMLElement;

  readonly boxWords: HTMLElement;

  readonly boxAccuracy: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.mainStatistics = document.createElement('div');
    this.container = document.createElement('div');
    this.containerWords = document.createElement('div');
    this.containerGames = document.createElement('div');
    this.boxWords = document.createElement('div');
    this.boxAccuracy = document.createElement('div');
    this.api = new API();
  }

  async render() {
    const statJson = sessionStorage.getItem('StatisticStorage');
    let storage;
    if (statJson) {
      storage = JSON.parse(statJson);
    } else {
      storage = StatisticStorage;
    }

    const userObjLocalStorage = localStorage.getItem('user');
    let userToken: string;
    let userID: string;

    if (userObjLocalStorage) {
      sessionStorage.removeItem('StatisticStorage');

      userToken = JSON.parse(userObjLocalStorage).token;
      userID = JSON.parse(userObjLocalStorage).userId;
      let userData = await this.api.getUserStatistics(userID, userToken);
      if (typeof userData === 'boolean') {
        const storage: IStatistic = {
          learnedWords: 0,
          optional: {
            AudioCountAnswerCorrect: 0,
            AudioCountAnswerWrong: 0,
            AudioInRow: 0,
            SprintCountAnswerCorrect: 0,
            SprintCountAnswerWrong: 0,
            SprintInRow: 0,
            SprintScore: 0,
          },
        };
        await this.api.saveUserStatistics(userID, userToken, storage);
        userData = (await this.api.getUserStatistics(userID, userToken)) as IStatistic;
      }
      const sumNewWords =
        userData.optional.AudioCountAnswerCorrect +
        userData.optional.AudioCountAnswerWrong +
        userData.optional.SprintCountAnswerCorrect +
        userData.optional.SprintCountAnswerWrong;

      this.root.appendChild(this.mainStatistics);
      this.mainStatistics.classList.add('main__statistics');

      new BaseComponent(this.mainStatistics, 'h2', ['main__statistics-title'], 'Today').render();
      this.mainStatistics.appendChild(this.container);
      this.container.classList.add('main__statistics__container');
      this.container.appendChild(this.containerWords);
      this.containerWords.classList.add('main__statistics__containerWords');
      this.containerWords.appendChild(this.boxWords);
      this.boxWords.classList.add('main__statistics__boxWords');
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-words-count'], `${sumNewWords}`).render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p1'], 'new words').render();

      this.boxWords.classList.add('main__statistics__boxWords');
      new BaseComponent(
        this.boxWords,
        'div',
        ['main__statistics__boxWords-words-count'],
        `${userData.learnedWords}`
      ).render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p1'], 'words').render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p2'], 'were learned').render();

      this.containerWords.appendChild(this.boxAccuracy);
      this.boxAccuracy.classList.add('main__statistics__boxAccuracy');
      new BaseComponent(this.boxAccuracy, 'div', ['main__statistics__boxAccuracy-title'], 'Accuracy').render();
      new BaseComponent(
        this.boxAccuracy,
        'div',
        ['main__statistics__boxAccuracy-percent'],
        `<span class="accuracy-percent">${Math.trunc((userData.learnedWords / sumNewWords) * 100) || '0'}</span>%`
      ).render();

      this.container.appendChild(this.containerGames);
      this.containerGames.classList.add('main__statistics__containerGames');
      new StatisticsBoxGames(this.containerGames, 'Sprint', userData).render();
      new StatisticsBoxGames(this.containerGames, 'Audio Challenge', userData).render();
    } else {
      const sumNewWords =
        storage.optional.AudioCountAnswerCorrect +
        storage.optional.AudioCountAnswerWrong +
        storage.optional.SprintCountAnswerCorrect +
        storage.optional.SprintCountAnswerWrong;

      this.root.appendChild(this.mainStatistics);
      this.mainStatistics.classList.add('main__statistics');

      new BaseComponent(this.mainStatistics, 'h2', ['main__statistics-title'], 'Today').render();
      this.mainStatistics.appendChild(this.container);
      this.container.classList.add('main__statistics__container');
      this.container.appendChild(this.containerWords);
      this.containerWords.classList.add('main__statistics__containerWords');
      this.containerWords.appendChild(this.boxWords);
      this.boxWords.classList.add('main__statistics__boxWords');
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-words-count'], `${sumNewWords}`).render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p1'], 'new words').render();

      this.boxWords.classList.add('main__statistics__boxWords');
      new BaseComponent(
        this.boxWords,
        'div',
        ['main__statistics__boxWords-words-count'],
        `${storage.learnedWords}`
      ).render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p1'], 'words').render();
      new BaseComponent(this.boxWords, 'div', ['main__statistics__boxWords-p2'], 'were learned').render();

      this.containerWords.appendChild(this.boxAccuracy);
      this.boxAccuracy.classList.add('main__statistics__boxAccuracy');
      new BaseComponent(this.boxAccuracy, 'div', ['main__statistics__boxAccuracy-title'], 'Accuracy').render();
      new BaseComponent(
        this.boxAccuracy,
        'div',
        ['main__statistics__boxAccuracy-percent'],
        `<span class="accuracy-percent">${Math.trunc((storage.learnedWords / sumNewWords) * 100) || '0'}</span>%`
      ).render();

      this.container.appendChild(this.containerGames);
      this.containerGames.classList.add('main__statistics__containerGames');
      new StatisticsBoxGames(this.containerGames, 'Sprint', storage).render();
      new StatisticsBoxGames(this.containerGames, 'Audio Challenge', storage).render();

      return this.mainStatistics;
    }
  }
}
