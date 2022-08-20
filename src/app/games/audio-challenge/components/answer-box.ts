import BaseComponent from '../../base-сomponent';

export default class AnswerBox {
  readonly answerBox: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.answerBox = document.createElement('div');
  }

  render(): HTMLElement {
    this.root.appendChild(this.answerBox);
    this.answerBox.classList.add('main__games__audio-challange__answerBox');

    new BaseComponent(this.answerBox, 'div', ['main__games__audio-challange__buttonAnswer', 'answer-0']).render();
    new BaseComponent(this.answerBox, 'div', ['main__games__audio-challange__buttonAnswer', 'answer-1']).render();
    new BaseComponent(this.answerBox, 'div', ['main__games__audio-challange__buttonAnswer', 'answer-2']).render();
    new BaseComponent(this.answerBox, 'div', ['main__games__audio-challange__buttonAnswer', 'answer-3']).render();

    return this.answerBox;
  }
}
