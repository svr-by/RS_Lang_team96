import Svg from './svg';
import { IWord } from '../../shared/interfaces';
import { wordsApiService } from '../../api/wordsApiService';
import { storageService } from '../../shared/services/storageService';
import { SignInResponse } from '../../shared/types';

class Description {
  private svg: Svg;
  private userData: null | SignInResponse;

  constructor() {
    this.svg = new Svg();
    this.userData = storageService.getLocal('user');
  }

  async appendTo(parent: HTMLElement, id: string) {
    parent.innerHTML = '';
    await wordsApiService.getWord(id).then((item: IWord | string | void) => {
      if (typeof item !== 'string' && item) {
        const newDescription = document.createElement('div');
        newDescription.className = 'content';
        newDescription.innerHTML = `
        <img class='content__image' src='https://rslang-team96.herokuapp.com/${item.image}' alt=${item.word}>
        <div class='${storageService.getLocal('user') ? 'buttons' : 'display-none'}'>
          <button class='buttons__difficult-button' id='in-difficult'>В сложные слова</button>
          <button class='buttons__difficult-button' id='in-learning'>Слово изученно</button>
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
        <div class='${storageService.getLocal('user') ? 'gaming-response' : 'display-none'}'>
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

      const buttonInDifficult = document.getElementById('in-difficult');
      buttonInDifficult &&
        buttonInDifficult.addEventListener('click', () => {
          this.addToDifficultWords(id);
        });

      const buttonInLearning = document.getElementById('in-learning');
      buttonInLearning &&
        buttonInLearning.addEventListener('click', () => {
          this.addToLearningWords(id);
        });
    });
  }

  addToDifficultWords(id: string) {
    const word = document.getElementById(id);
    if (word) {
      if (word.classList.contains('learned-word')) {
        this.userData && wordsApiService.updateUserWord(this.userData.userId, id, { difficulty: 'hard' });
        document.querySelectorAll('.word').forEach((item) => {
          if (item.id === id) {
            item.classList.remove('learned-word');
            item.classList.add('hard-word');
          }
        });
      } else {
        this.userData && wordsApiService.addUserWord(this.userData.userId, id, { difficulty: 'hard' });
        document.querySelectorAll('.word').forEach((item) => {
          if (item.id === id) {
            item.classList.add('hard-word');
          }
        });
      }
    }
  }

  addToLearningWords(id: string) {
    const word = document.getElementById(id);
    if (word) {
      if (word.classList.contains('hard-word')) {
        this.userData && wordsApiService.updateUserWord(this.userData.userId, id, { difficulty: 'learned' });
        document.querySelectorAll('.word').forEach((item) => {
          if (item.id === id) {
            item.classList.remove('hard-word');
            item.classList.add('learned-word');
          }
        });
      } else {
        this.userData && wordsApiService.addUserWord(this.userData.userId, id, { difficulty: 'learned' });
        document.querySelectorAll('.word').forEach((item) => {
          if (item.id === id) {
            item.classList.add('learned-word');
          }
        });
      }
    }
  }
}

export default Description;
