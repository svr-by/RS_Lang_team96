import BaseComponent from '../../shared/components/base_component';
import AudioChallangeLvl from './audio-challenge/audio-challenge-levels';
import SprintLvl from './sprint/sprint-levels';

export default class Games {
  readonly mainGames: HTMLElement;

  readonly audioGame: HTMLElement;

  readonly sprintGame: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.mainGames = document.createElement('div');
    this.audioGame = document.createElement('div');
    this.sprintGame = document.createElement('div');
  }

  pushBtnPlayAudio(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      this.mainGames.remove();
      new AudioChallangeLvl(this.root).render();
    }
  }

  pushBtnPlaySprint(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      this.mainGames.remove();
      new SprintLvl(this.root).render();
    }
  }

  render() {
    this.root.appendChild(this.mainGames);
    this.mainGames.classList.add('main__games');

    this.mainGames.appendChild(this.audioGame);
    this.audioGame.classList.add('main__games-audio');
    new BaseComponent(this.audioGame, 'div', ['game-audio__title'], 'audio challenge').render();
    new BaseComponent(
      this.audioGame,
      'div',
      ['game-audio__description'],
      'A word is voiced to you, and you choose the correct translation'
    ).render();
    new BaseComponent(this.audioGame, 'button', ['game-audio__play'], 'play')
      .render()
      .addEventListener('click', ({ target }) => this.pushBtnPlayAudio(target as HTMLElement));

    this.mainGames.appendChild(this.sprintGame);
    this.sprintGame.classList.add('main__games-sprint');
    new BaseComponent(this.sprintGame, 'div', ['game-sprint__title'], 'sprint').render();
    new BaseComponent(
      this.sprintGame,
      'div',
      ['game-sprint__description'],
      'In 10 seconds you have to answer the maximum number of correctly translated words'
    ).render();
    new BaseComponent(this.sprintGame, 'button', ['game-sprint__play'], 'play')
      .render()
      .addEventListener('click', ({ target }) => this.pushBtnPlaySprint(target as HTMLElement));

    return this.mainGames;
  }
}
