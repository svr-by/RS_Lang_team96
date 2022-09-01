import Svg from './svg';
import { IWord } from '../../shared/interfaces';
import API from '../../api';
import LocalStorage from '../../shared/services/localStorage';

class Description {
  private svg: Svg;
  private API: API;
  private localStorage: LocalStorage;

  constructor() {
    this.svg = new Svg();
    this.API = new API();
    this.localStorage = new LocalStorage();
  }

  async appendTo(parent: HTMLElement, id: string) {
    parent.innerHTML = '';
    await this.API.getWord(id).then((item: IWord | string | void) => {
      if (typeof item !== 'string' && item) {
        const newDescription = document.createElement('div');
        newDescription.className = 'content';
        newDescription.innerHTML = `
        <img class='content__image' src='https://rslang-team96.herokuapp.com/${item.image}' alt=${item.word}>
        <div class='${this.localStorage.get('user') ? 'buttons' : 'display-none'}'>
          <button class='buttons__difficult-button'>В сложные слова</button>
          <button class='buttons__difficult-button'>Слово изученно</button>
        </div>
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
        <div class='${this.localStorage.get('user') ? 'gaming-response' : 'display-none'}'>
          <div class='audio-call game'>
            <p class='game__name'>Аудио-вызов</p>
            <div class='game__text'>
              <p class='game__correct-text'>Угаданно верно:</p>
              <p class='game__correct-number' id='audio-call-correct'>0</p>
            </div>
            <div class='game__text'>
              <p class='game__correct-text'>Ошибался:</p>
              <p class='game__correct-number' id='audio-call-was-wrong'>0</p>
            </div>
          </div>
          <div class='sprint game'>
            <p class='game__name'>Спринт</p>
            <div class='game__text'>
              <p class='game__correct-text'>Угаданно верно:</p>
              <p class='game__correct-number' id='sprint-correct'>0</p>
            </div>
            <div class='game__text'>
              <p class='game__correct-text'>Ошибался:</p>
              <p class='game__correct-number' id='sprint-was-wrong'>0</p>
            </div>
          </div>
        </div>
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
