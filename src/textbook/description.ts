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
      newDescription.innerHTML = `
        <img src='https://rslang-team96.herokuapp.com/${item.image}' alt=${item.word}>
        <p>${item.word}</p>
        <p>${item.wordTranslate}</p>
        <div class='transcription'>
          <p class='transcription__value'>${item.transcription}</p>
          <audio class='sound' src='https://rslang-team96.herokuapp.com/${item.audio}' id='sound'></audio>
          ${this.svg.playSvg()}
        </div>
        <h3>Значение</h3>
        <p>${item.textMeaning}</p>
        <p>${item.textMeaningTranslate}</p>
        <h3>Пример</h3>
        <p>${item.textExample}</p>
        <p>${item.textExampleTranslate}</p>
      `;
      parent.append(newDescription);
    });
  }
}

export default Description;
