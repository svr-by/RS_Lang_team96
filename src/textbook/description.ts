import { WordType } from '../types';
import Words from '../api/words';
import Svg from '../textBookSvg/svg';

class Description {
  private wordsApi: Words;
  private svg: Svg;
  constructor() {
    this.svg = new Svg();
    this.wordsApi = new Words();
  }

  async appendTo(parent: HTMLElement, id: string) {
    parent.innerHTML = '';
    await this.wordsApi.getWordDescription(id).then((item: WordType) => {
      const newDescription = document.createElement('div');
      newDescription.className = 'content';
      newDescription.innerHTML = `
        <img class='content__image' src='https://rslang-team96.herokuapp.com/${item.image}' alt=${item.word}>
        <p class='content__word'>${item.word}</p>
        <p class='content__word-translate russian'>${item.wordTranslate}</p>
        <div class='transcription'>
          <p class='transcription__value'>${item.transcription}</p>
          <audio class='sound' src='https://rslang-team96.herokuapp.com/${item.audio}' id='sound'></audio>
          ${this.svg.playSvg('#8f8e8e', 'transcription__play')}
        </div>
        <h3 class='content__header'>Значение</h3>
        <p class='content__text'>${item.textMeaning}</p>
        <p class='content__text russian'>${item.textMeaningTranslate}</p>
        <h3 class='content__header'>Пример</h3>
        <p class='content__text'>${item.textExample}</p>
        <p class='content__text russian'>${item.textExampleTranslate}</p>
      `;
      parent.append(newDescription);

      (document.getElementById('playSvg') as HTMLElement).addEventListener('click', () => {
        (document.getElementById('sound') as HTMLAudioElement).play();
      });
    });
  }
}

export default Description;
