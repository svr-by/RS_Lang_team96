import BaseComponent from '../../base-сomponent';
import IStorage from '../../../interfaces/audio-challenge-storage';

export default class StatWordsAnswer {
  readonly statWordsAnswer: HTMLElement;

  constructor(readonly root: HTMLElement, public storage: IStorage) {
    this.statWordsAnswer = document.createElement('div');
  }

  playSoundWordAnswer(target: HTMLElement | null): void {
    if (target && target.tagName === 'DIV') {
      const sound = new Audio();
      const ind = target.getAttribute('data-ind');
      sound.src = this.storage.namesAnswerСorrectSound[+ind!];
      sound.autoplay = true;
    }
  }

  render(): HTMLElement {
    this.root.appendChild(this.statWordsAnswer);
    this.statWordsAnswer.classList.add('result-answer');

    new BaseComponent(this.statWordsAnswer, 'div', ['result-answer__plus']).render();
    new BaseComponent(this.statWordsAnswer, 'h2', ['result-answer__name'], 'Right').render();
    for (let i = 0; i < this.storage.namesAnswerСorrect.length; i += 1) {
      new BaseComponent(
        this.statWordsAnswer,
        'section',
        ['result-answer__container'],
        `<div class = "result__sound-answer" data-ind = "${i}"></div><span class = "result__word">${this.storage.namesAnswerСorrect[i]}</span><span class = "result__translate"> - ${this.storage.namesAnswerСorrectTranslate[i]}</span>`
      ).render();
    }

    const btnSound: NodeListOf<Element> = document.querySelectorAll('.result__sound-answer');
    if (btnSound) {
      btnSound.forEach((el) =>
        el.addEventListener('click', ({ target }) => this.playSoundWordAnswer(target as HTMLElement))
      );
    }

    return this.statWordsAnswer;
  }
}
