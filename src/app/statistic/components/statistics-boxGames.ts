import BaseComponent from '../../../shared/components/base_component';
import IStatistic from '../../../interfaces/statistic';

export default class StatisticsBoxGames {
  readonly statisticsBoxGames: HTMLElement;

  constructor(private readonly root: HTMLElement, readonly text: string, public storage: IStatistic) {
    this.statisticsBoxGames = document.createElement('div');
    this.text = text;
    this.storage = storage;
  }

  render(): HTMLElement {
    this.root.appendChild(this.statisticsBoxGames);
    this.statisticsBoxGames.classList.add('main__statistics__boxGames');

    const allWordsSprint =
      this.storage.optional.SprintCountAnswerWrong + this.storage.optional.SprintCountAnswerCorrect;

    const allWordsAudio = this.storage.optional.AudioCountAnswerWrong + this.storage.optional.AudioCountAnswerCorrect;

    if (this.text === 'Sprint') {
      new BaseComponent(this.statisticsBoxGames, 'div', [
        'main__statistics__boxGames-img',
        'main__statistics__boxGames-img__sprint',
      ]).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-nameGame'],
        `${this.text}`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row1'],
        `<span class="game-words">${allWordsSprint}</span><span>  words</span>`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row2'],
        `<span class="game-accuracy">${
          Math.trunc((this.storage.optional.SprintCountAnswerCorrect / allWordsSprint) * 100) || '0'
        }</span><span>% accuracy</span>`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row3'],
        `<span class="game-inRow">${this.storage.optional.SprintInRow}</span><span>  in a row</span>`
      ).render();
    }

    if (this.text === 'Audio Challenge') {
      new BaseComponent(this.statisticsBoxGames, 'div', [
        'main__statistics__boxGames-img',
        'main__statistics__boxGames-img__audio',
      ]).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-nameGame'],
        `${this.text}`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row1'],
        `<span class="game-words">${allWordsAudio}</span><span>  words</span>`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row2'],
        `<span class="game-accuracy">${
          Math.trunc((this.storage.optional.AudioCountAnswerCorrect / allWordsAudio) * 100) || '0'
        }</span><span>% accuracy</span>`
      ).render();
      new BaseComponent(
        this.statisticsBoxGames,
        'div',
        ['main__statistics__boxGames-row3'],
        `<span class="game-inRow">${this.storage.optional.AudioInRow}</span><span>  in a row</span>`
      ).render();
    }

    return this.statisticsBoxGames;
  }
}
