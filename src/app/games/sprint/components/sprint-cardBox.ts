import BaseComponent from '../../../../shared/components/base_component';
import IWord from '../../../../shared/interfaces/word';

export default class CardBox {
  readonly cardBox: HTMLElement;

  readonly panel: HTMLElement;

  constructor(private readonly root: HTMLElement, public wordsInGroup: IWord[], public currentWord: IWord) {
    this.cardBox = document.createElement('div');
    this.panel = document.createElement('div');
  }

  render(): HTMLElement {
    this.root.appendChild(this.cardBox);
    this.cardBox.classList.add('sprint__card-box');

    this.cardBox.appendChild(this.panel);
    this.panel.classList.add('sprint__panel');

    new BaseComponent(this.panel, 'div', ['sprint__mark-1', 'mark']).render();
    new BaseComponent(this.panel, 'div', ['sprint__mark-2', 'mark']).render();
    new BaseComponent(this.panel, 'div', ['sprint__mark-3', 'mark']).render();

    new BaseComponent(this.cardBox, 'div', ['sprint__img-box']).render();
    new BaseComponent(this.cardBox, 'div', ['sprint__button-sound']).render();
    new BaseComponent(this.cardBox, 'h3', ['sprint__word'], `${this.currentWord.word}`).render();

    const randomNum = Math.floor(Math.random() * 600);
    if (randomNum === 0 || randomNum % 2 === 0) {
      new BaseComponent(
        this.cardBox,
        'h3',
        ['sprint__translate'],
        `${this.wordsInGroup[randomNum].wordTranslate}`
      ).render();
    } else {
      new BaseComponent(this.cardBox, 'h3', ['sprint__translate'], `${this.currentWord.wordTranslate}`).render();
    }

    return this.cardBox;
  }
}
