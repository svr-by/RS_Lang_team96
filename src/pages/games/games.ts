import BaseComponent from '../../shared/components/base_component';
import AudioChallangeLvl from './audio-challenge/audio-challenge-levels';
import SprintLvl from './sprint/sprint-levels';

export default class Games {
  readonly mainGames: HTMLElement;
  readonly audioGame: HTMLElement;
  readonly sprintGame: HTMLElement;

  constructor() {
    this.mainGames = document.createElement('div');
    this.audioGame = document.createElement('div');
    this.sprintGame = document.createElement('div');
  }

  pushBtnPlayAudio(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      this.mainGames.innerHTML = '';
      new AudioChallangeLvl(this.mainGames).render();
    }
  }

  pushBtnPlaySprint(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      this.mainGames.innerHTML = '';
      new SprintLvl(this.mainGames).render();
    }
  }

  render() {
    this.mainGames.innerHTML = '';
    this.audioGame.innerHTML = '';
    this.sprintGame.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    this.mainGames.classList.add('main__games');

    this.mainGames.appendChild(this.audioGame);
    this.audioGame.classList.add('main__games-audio');

    new BaseComponent(this.audioGame, 'div', ['game-audio__title'], '"Аудиовызов"').render();
    new BaseComponent(
      this.audioGame,
      'div',
      ['game-audio__description'],
      'Тренирует восприятие английских слов на слух'
    ).render();
    new BaseComponent(this.audioGame, 'button', ['game-audio__play'], 'Играть')
      .render()
      .addEventListener('click', ({ target }) => this.pushBtnPlayAudio(target as HTMLElement), { once: true });

    this.mainGames.appendChild(this.sprintGame);
    this.sprintGame.classList.add('main__games-sprint');
    new BaseComponent(this.sprintGame, 'div', ['game-sprint__title'], '"Спринт"').render();
    new BaseComponent(
      this.sprintGame,
      'div',
      ['game-sprint__description'],
      'Тренировка на быстрое воспроизвдение слов из памяти'
    ).render();
    new BaseComponent(this.sprintGame, 'button', ['game-sprint__play'], 'Играть')
      .render()
      .addEventListener('click', ({ target }) => this.pushBtnPlaySprint(target as HTMLElement), { once: true });

    wrapper.append(this.mainGames);
    return wrapper;
  }
}
