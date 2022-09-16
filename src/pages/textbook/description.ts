import Svg from './svg';
import { wordsApiService } from '../../api/wordsApiService';
import { storageService } from '../../shared/services/storageService';
import { SignInResponse } from '../../shared/types';
import { Preloader } from '../../shared/components/preloader';
import { IWord } from '../../shared/interfaces';

class Description {
  private svg: Svg;
  private userData: null | SignInResponse;

  constructor() {
    this.svg = new Svg();
    this.userData = storageService.getLocal('user');
  }

  async appendTo(parent: HTMLElement, id: string) {
    parent.innerHTML = '';
    parent.className = 'dictionary__description';
    const preloader = new Preloader('inner').render();
    parent.append(preloader);

    const wordData: IWord[] | null = storageService.getSession('wordsData');
    if (wordData) {
      const item = wordData.find((item) => {
        if (item.id) {
          return item.id === id;
        }
        if (item._id) {
          return item._id === id;
        }
      });

      parent.innerHTML = '';

      if (item) {
        const newDescription = document.createElement('div');
        newDescription.className = 'content';
        newDescription.innerHTML = `
        <img class='content__image' src='https://rslang-team96.herokuapp.com/${item.image}' alt=${item.word}>
        <div class='${storageService.getLocal('user') ? 'buttons' : 'display-none'}'>
          <button class='${
            storageService.getSession('sect') === 'difficult words' ? 'display-none' : 'buttons__difficult-button'
          }' id='in-difficult'>В сложные слова</button>
          <button class='${
            storageService.getSession('sect') === 'studied words' ? 'display-none' : 'buttons__difficult-button'
          }' id='in-learning'>В изученные слова</button>
        </div>
        <p class='content__word'>${item.word}</p>
        <p class='content__word-translate russian'>${item.wordTranslate}</p>
        <div class='transcription'>
          <p class='transcription__value'>${item.transcription}</p>
          <audio class='sound' src='https://rslang-team96.herokuapp.com/${item.audio}' id='sound'></audio>
          <audio class='sound' src='https://rslang-team96.herokuapp.com/${item.audioExample}' id='audioExample'></audio>
          <audio class='sound' src='https://rslang-team96.herokuapp.com/${item.audioMeaning}' id='audioMeaning'></audio>
          ${this.svg.playSvg('#8f8e8e', 'transcription__play')}
        </div>
        <h3 class='content__header'>Значение</h3>
        <p class='content__text'>${item.textMeaning}</p>
        <p class='content__text russian'>${item.textMeaningTranslate}</p>
        <h3 class='content__header'>Пример</h3>
        <p class='content__text'>${item.textExample}</p>
        <p class='content__text russian'>${item.textExampleTranslate}</p>
        <div class=${storageService.getLocal('user') ? 'gaming-response' : 'display-none'}>
          <div class='audio-call game'>
            <p class='game__name'>Аудио-вызов: 
            <span id='audio-call-correct'>0</span> | <span id='audio-call-was-wrong'>0</span>
            </p>
          </div>
          <div class='sprint-results game'>
            <p class='game__name'>Спринт: 
              <span id='sprint-correct'>0</span> | <span id='sprint-was-wrong'>0</span>
            </p>
          </div>
        </div>
      `;
        parent.append(newDescription);
      } else {
        throw new Error(`Error ${item}`);
      }
    }

    (parent.querySelector('#playSvg') as HTMLElement).addEventListener('click', () => {
      const sound = (document.getElementById('sound') as HTMLAudioElement) || null;
      const audioMeaning = (document.getElementById('audioMeaning') as HTMLAudioElement) || null;
      const audioExample = (document.getElementById('audioExample') as HTMLAudioElement) || null;

      sound &&
        sound.addEventListener('ended', () => {
          audioMeaning && audioMeaning.play();
        });

      audioMeaning &&
        audioMeaning.addEventListener('ended', () => {
          audioExample && audioExample.play();
        });

      if (sound) sound.play();
    });

    const buttonInDifficult = parent.querySelector('#in-difficult');
    buttonInDifficult &&
      buttonInDifficult.addEventListener('click', () => {
        this.addToDifficultWords(id);
      });

    const buttonInLearning = parent.querySelector('#in-learning');
    buttonInLearning &&
      buttonInLearning.addEventListener('click', () => {
        this.addToLearningWords(id);
      });

    this.addStyleForPage();
    this.addWinsMistaces(id);
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
      this.addStyleForPage();
    }

    if (storageService.getSession('sect') === 'studied words') {
      this.userData && wordsApiService.updateUserWord(this.userData.userId, id, { difficulty: 'hard' });
      document.querySelectorAll('.word').forEach((item) => {
        if (item.id === id) {
          item.classList.add('display-none');
        }
      });
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
      this.addStyleForPage();
    }

    if (storageService.getSession('sect') === 'difficult words') {
      this.userData && wordsApiService.updateUserWord(this.userData.userId, id, { difficulty: 'learned' });
      document.querySelectorAll('.word').forEach((item) => {
        if (item.id === id) {
          item.classList.add('display-none');
        }
      });
    }
  }

  addStyleForPage() {
    const hardWords = document.querySelectorAll('.hard-word');
    const learnedWords = document.querySelectorAll('.learned-word');
    const numberElements = hardWords.length + learnedWords.length;
    const words = document.querySelector('.words');
    const curtainLinks = document.querySelector('.links__unactive');
    const audioChallengeLink = document.querySelector('#links-to-audio-challenge') as HTMLButtonElement;
    const sprintLinks = document.querySelector('#links-to-sprint') as HTMLButtonElement;
    if (numberElements === 20) {
      const selectedPage = document.querySelector('.selected-page');
      selectedPage && selectedPage.classList.add('learned-page');
      words && words.classList.add('learned-words-background');
      curtainLinks && curtainLinks.classList.remove('display-none');
      audioChallengeLink && (audioChallengeLink.disabled = true);
      sprintLinks && (sprintLinks.disabled = true);
    } else {
      curtainLinks && curtainLinks.classList.add('display-none');
      audioChallengeLink && (audioChallengeLink.disabled = false);
      sprintLinks && (sprintLinks.disabled = false);
      words && words.classList.remove('learned-words-background');
    }
  }

  addWinsMistaces(id: string) {
    const audioCallCorrect = document.getElementById('audio-call-correct');
    const audioCallWasWrong = document.getElementById('audio-call-was-wrong');
    const sprintCorrect = document.getElementById('sprint-correct');
    const sprintWasWrong = document.getElementById('sprint-was-wrong');
    const userData: null | SignInResponse = storageService.getLocal('user');
    if (userData) {
      wordsApiService.getAggregatedWordsById(userData.userId, id).then((item) => {
        if (item) {
          if (audioCallCorrect) {
            audioCallCorrect.innerText = `${
              item[0].userWord?.optional?.games?.audioCall?.right
                ? item[0].userWord?.optional?.games?.audioCall?.right
                : '0'
            }`;
          }
          if (audioCallWasWrong) {
            audioCallWasWrong.innerText = `${
              item[0].userWord?.optional?.games?.audioCall?.wrong
                ? item[0].userWord?.optional?.games?.audioCall?.wrong
                : '0'
            }`;
          }
          if (sprintCorrect) {
            sprintCorrect.innerText = `${
              item[0].userWord?.optional?.games?.sprint?.right ? item[0].userWord?.optional?.games?.sprint?.right : '0'
            }`;
          }
          if (sprintWasWrong) {
            sprintWasWrong.innerText = `${
              item[0].userWord?.optional?.games?.sprint?.wrong ? item[0].userWord?.optional?.games?.sprint?.wrong : '0'
            }`;
          }
        }
      });
    }
  }
}

export default Description;
