import BaseComponent from '../../../../shared/components/base_component';
import { IStorage } from '../../../../shared/interfaces';

export default class StatWordsWrong {
  readonly statWordsWrong: HTMLElement;

  constructor(readonly root: HTMLElement, public storage: IStorage) {
    this.statWordsWrong = document.createElement('div');
  }

  playSoundWordWrong(target: HTMLElement | null): void {
    if (target && target.tagName === 'DIV') {
      const sound = new Audio();
      const ind = target.getAttribute('data-ind');
      if (ind) {
        sound.src = this.storage.namesAnswerWrongSound[+ind];
      }
      sound.autoplay = true;
    }
  }

  render(): HTMLElement {
    this.root.appendChild(this.statWordsWrong);
    this.statWordsWrong.classList.add('result-wrong');

    new BaseComponent(this.statWordsWrong, 'div', ['result-wrong__minus']).render();
    new BaseComponent(this.statWordsWrong, 'h2', ['result-wrong__name'], 'Wrong').render();
    for (let i = 0; i < this.storage.namesAnswerWrong.length; i += 1) {
      new BaseComponent(
        this.statWordsWrong,
        'section',
        ['result-wrong__container'],
        `<div class = "result__sound-wrong"  data-ind = "${i}"></div><span class = "result__word">${this.storage.namesAnswerWrong[i]}</span><span class = "result__trans"> - ${this.storage.namesAnswerWrongTranslate[i]}</span>`
      ).render();
    }

    const btnSound: NodeListOf<Element> = document.querySelectorAll('.result__sound-wrong');
    if (btnSound) {
      btnSound.forEach((el) =>
        el.addEventListener('click', ({ target }) => this.playSoundWordWrong(target as HTMLElement))
      );
    }

    return this.statWordsWrong;
  }
}
