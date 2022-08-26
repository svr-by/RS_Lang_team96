import Svg from './svg';
import { IWord } from '../../shared/interfaces';
import API from '../../api';

class Description {
  private svg: Svg;
  private API: API;

  constructor() {
    this.svg = new Svg();
    this.API = new API();
  }

  async appendTo(parent: HTMLElement, id: string) {
    parent.innerHTML = '';
    await this.API.getWord(id).then((item: IWord | string | void) => {
      if (typeof item !== 'string' && item) {
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
      } else {
        throw new Error(`Error ${item}`);
      }

      (document.getElementById('playSvg') as HTMLElement).addEventListener('click', () => {
        (document.getElementById('sound') as HTMLAudioElement).play();
      });
    });
  }
}

export default Description;
