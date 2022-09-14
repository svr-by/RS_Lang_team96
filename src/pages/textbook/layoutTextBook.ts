import Svg from './svg';
import Level from './level';
import { dataLevels } from './levelsEnglishData';
import Pagination from './pagination';
import Description from './description';
import Word from './word';
import SettingsModal from './settingsModal';
import { IAggregatedWord, IStorage, IWord } from '../../shared/interfaces';
import { wordsApiService } from '../../api/wordsApiService';
import { storageService } from '../../shared/services/storageService';
import { SignInResponse } from '../../shared/types';
import AudioChallange from '../games/audio-challenge/audio-challenge';
import Sprint from '../games/sprint/sprint';
import { Views } from '../../shared/enums';
import { Preloader } from '../../shared/components/preloader';
import { Modal } from '../../shared/components/modal';
import { layoutService } from '../../shared/services/layoutService';

class LayoutTextBook {
  private svg: Svg;
  private groupNumber: { name: string; numbers: string; id: string }[];
  private description: Description;
  private wordsInGroup: IWord[];
  private currentCountWord: string;

  constructor() {
    this.svg = new Svg();
    this.groupNumber = dataLevels;
    this.description = new Description();
    this.wordsInGroup = [] as IWord[];
    this.currentCountWord = '1';
  }

  async renderTextBook() {
    const textBook = document.createElement('section');
    textBook.className = 'textBook';
    textBook.id = 'textBook';
    textBook.innerHTML = `
      <div class='wrapper wrapper-textbook'>
        <div class='header-and-settings' id='header-and-settings'>
          <h2 class='header-and-settings__header' id='textbook-words'>Учебник</h2>
          <h2 class='${
            storageService.getLocal('user') ? 'header-and-settings__header' : 'display-none'
          }' id='difficult-words'>Сложные слова</h2>
          <h2 class='${
            storageService.getLocal('user') ? 'header-and-settings__header' : 'display-none'
          }' id='studied-words'>Изученные слова</h2>
          ${this.svg.settingsSvg('#ffef4f', 'header-and-settings__settings', 'settings')}
        </div>
        
        <div class='levels' id='levels'></div>
        <div class='words'>
          <h2 class='words__header'>Слова</h2>
          <div class='dictionary'>
            <div class='dictionary__value' id='words'></div>
            <div id='description'></div>
          </div>
        </div>
        <div class='page-navigation' id='pagination'></div>

        <div class='games'>
          <p class='games__description'>Закрепите новые слова при помощи игр 
            <button class='links__audio-challenge' id='links-to-audio-challenge'>Аудиовызов</button>
            и 
            <button class='links__audio-challenge' id='links-to-sprint'>Спринт</button>
          </p>
        </div>
      </div>
    `;

    if (!storageService.getSession('level')) {
      storageService.setSession('level', '0');
    }

    if (!storageService.getSession('pageNumber')) {
      storageService.setSession('pageNumber', '0');
    }

    if (!storageService.getSession('sect')) {
      storageService.setSession('sect', 'text-book');
    }

    this.highlightSelectedPartition(textBook);

    if (storageService.getSession('sect') === 'text-book') await this.addLevels(textBook);
    if (storageService.getSession('sect') === 'difficult words') await this.addDifficultWords(textBook);
    if (storageService.getSession('sect') === 'studied words') await this.addLearnedWords(textBook);

    const pagination = textBook.querySelector('#pagination') as HTMLElement;

    new Pagination(textBook).appendTo(pagination);

    new SettingsModal().appendTo(textBook);

    const headerAndSettings = textBook.querySelector('#header-and-settings');

    if (headerAndSettings !== null) {
      headerAndSettings.addEventListener('click', (event) => {
        event.stopPropagation();
        if (event instanceof MouseEvent) {
          this.modeSwitching(event, textBook);
        }
      });
    }

    const linksToAudioChallenge = textBook.querySelector('#links-to-audio-challenge');
    if (linksToAudioChallenge) {
      linksToAudioChallenge.addEventListener('click', () => this.linksToGame('AudioChalenge'));
    }

    const linksToSprint = textBook.querySelector('#links-to-sprint');
    if (linksToSprint) {
      linksToSprint.addEventListener('click', () => this.linksToGame('Sprint'));
    }

    return textBook;
  }

  modeSwitching(event: MouseEvent, textBook: HTMLElement) {
    if (event.target instanceof Element) {
      if (event.target.parentElement instanceof Element)
        if (event.target.parentElement.id === 'settings') this.addSettings(textBook);

      if (event.target.id === 'textbook-words') this.addLevels(textBook);

      if (event.target.id === 'difficult-words') this.addDifficultWords(textBook);

      if (event.target.id === 'studied-words') this.addLearnedWords(textBook);
    }
  }

  async addDifficultWords(textBook: HTMLElement) {
    storageService.setSession('sect', 'difficult words');
    this.addAndDeletePagination(textBook);
    const pagination = textBook.querySelector('#pagination');
    pagination && pagination.classList.add('display-none');
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels');
    if (levels) {
      levels.innerHTML = '';
    }
    const words = textBook.querySelector('#words') as HTMLElement;
    const hardWords = await this.getHardWords();
    if (hardWords) {
      words.innerHTML = '';
      hardWords.forEach((item: IAggregatedWord, index: number) => {
        this.addWordAndDescription(item, index, textBook, words);
      });
    }
  }

  async addLearnedWords(textBook: HTMLElement) {
    storageService.setSession('sect', 'studied words');
    this.addAndDeletePagination(textBook);
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels');
    if (levels) {
      levels.innerHTML = '';
    }
    const words = textBook.querySelector('#words') as HTMLElement;
    const learnedWords = await this.getLearnedWords();
    if (learnedWords) {
      words.innerHTML = '';
      learnedWords.forEach((item: IAggregatedWord, index: number) => {
        this.addWordAndDescription(item, index, textBook, words);
      });
    }
  }

  addAndDeletePagination(textBook: HTMLElement) {
    const pagination = textBook.querySelector('#pagination');
    const sect = storageService.getSession('sect');

    pagination &&
      sect &&
      (sect === 'difficult words' || sect === 'studied words') &&
      pagination.classList.add('display-none');

    pagination && sect && sect === 'text-book' && pagination.classList.remove('display-none');
  }

  addWordAndDescription(item: IAggregatedWord, index: number, textBook: HTMLElement, words: HTMLElement) {
    if (index === 0) {
      const description = textBook.querySelector('#description') as HTMLElement;
      this.description.appendTo(description, item._id);
      storageService.setSession('chosenWordId', item._id);
    }
    new Word(item._id, item.word, item.wordTranslate).appendTo(words);
  }

  addLevels(textBook: HTMLElement) {
    storageService.setSession('sect', 'text-book');
    this.addAndDeletePagination(textBook);
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels') as HTMLElement;
    this.groupNumber.forEach((item, index) => {
      new Level(item.name, item.numbers, item.id, index, textBook).appendTo(levels);
    });
  }

  async getHardWords() {
    const userData: null | SignInResponse = storageService.getLocal('user');
    if (userData) {
      return await wordsApiService.getUserHardWords(userData.userId).then((item) => {
        if (item) {
          return [...item][0].paginatedResults;
        }
      });
    }
  }

  async getLearnedWords() {
    const userData: null | SignInResponse = storageService.getLocal('user');
    if (userData) {
      return await wordsApiService.getUserLearnedWords(userData.userId).then((item) => {
        if (item) {
          return [...item][0].paginatedResults;
        }
      });
    }
  }

  async addWords(page: number, group: number, textBook: HTMLElement) {
    const words = textBook.querySelector('#words') as HTMLElement;
    const preloader = new Preloader().render();
    words.append(preloader);
    const userData: null | SignInResponse = storageService.getLocal('user');
    if (userData) {
      const hardWords = await this.getHardWords();

      const learnedWords = await this.getLearnedWords();

      const data = await wordsApiService.getAggregatedUserWords(userData.userId, page, group, 20);

      if (Array.isArray(data)) {
        const wordsData = data[0].paginatedResults;
        storageService.setSession('wordsData', wordsData);
        words.innerHTML = '';
        wordsData.forEach((item: IAggregatedWord, index: number) => {
          if (index === 0) {
            const description = textBook.querySelector('#description') as HTMLElement;
            this.description.appendTo(description, item._id);
            storageService.setSession('chosenWordId', item._id);
          }
          new Word(item._id, item.word, item.wordTranslate, hardWords, learnedWords).appendTo(words);
        });
      }
    } else {
      const data = await wordsApiService.getWords(group, page);
      storageService.setSession('wordsData', data);
      if (Array.isArray(data)) {
        words.innerHTML = '';
        data.forEach((item: IWord, index: number) => {
          if (index === 0) {
            const description = textBook.querySelector('#description') as HTMLElement;
            if (item.id) this.description.appendTo(description, item.id);
            storageService.setSession('chosenWordId', item.id);
          }
          if (item.id) new Word(item.id, item.word, item.wordTranslate).appendTo(words);
        });
      }
    }
    preloader.remove();
  }

  highlightSelectedPartition(textBook: HTMLElement) {
    const textbookWords: HTMLElement | null = textBook.querySelector('#textbook-words');
    const difficultWords: HTMLElement | null = textBook.querySelector('#difficult-words');
    const studiedWords: HTMLElement | null = textBook.querySelector('#studied-words');

    if (textbookWords !== null && difficultWords !== null && studiedWords !== null) {
      storageService.getSession('sect') === 'text-book'
        ? (textbookWords.style.color = '#000000')
        : (textbookWords.style.color = '');

      storageService.getSession('sect') === 'difficult words'
        ? (difficultWords.style.color = '#000000')
        : (difficultWords.style.color = '');

      storageService.getSession('sect') === 'studied words'
        ? (studiedWords.style.color = '#000000')
        : (studiedWords.style.color = '');
    }
  }

  addSettings(textBook: HTMLElement) {
    (textBook.querySelector('#settings-modal') as HTMLElement).classList.remove('display-none');
    (textBook.querySelector('#toggle') as HTMLInputElement).addEventListener('change', (event) => {
      event.stopPropagation();
      document.querySelectorAll('.russian').forEach((item) => {
        item.classList.toggle('display-none');
      });
    });
    document.addEventListener(
      'click',
      (event) => {
        const menu = document.getElementById('settings-modal') as HTMLElement;
        const menu_is_active = menu.classList.contains('display-none');
        const target = event.target as HTMLElement;
        const menuHeader = document.querySelector('.settings-modal__header');
        const menuRussianCheckbox = document.querySelector('.russian-on-off__checkbox-label');
        const menuCheckboxDescription = document.querySelector('.russian-on-off__description');
        const menuCheckbox = document.querySelector('.russian-on-off__checkbox');
        const its_menu =
          target === menu ||
          target === menuHeader ||
          target === menuRussianCheckbox ||
          target === menuCheckboxDescription ||
          target === menuCheckbox;

        if (menu && !its_menu && !menu_is_active) {
          (document.getElementById('settings-modal') as HTMLElement).classList.toggle('display-none');
        }
      },
      true
    );
  }

  async linksToGame(game: string) {
    const group = storageService.getSession<string>('level') || '0';
    const page = storageService.getSession<string>('pageNumber') || '0';
    const userData: null | SignInResponse = storageService.getLocal('user');
    if (userData) {
      const arrOfAgrResp = (await wordsApiService.getUserUnlearnedWords(userData.userId, +page, +group)) || [];
      this.wordsInGroup = arrOfAgrResp[0].paginatedResults;
    } else {
      this.wordsInGroup = (await wordsApiService.getWords(+group, +page)) || [];
    }

    if (this.wordsInGroup.length <= 4) {
      const mess = layoutService.createElement({
        tag: 'h3',
        text: 'Слишком мало неизученных слов для игры. Попробуйте другую страницу.',
      });
      new Modal().showModal(mess);
      return;
    }

    const storage: IStorage = {
      countAnswerCorrect: 0,
      namesAnswerCorrect: [],
      namesAnswerCorrectTranslate: [],
      namesAnswerCorrectSound: [],
      inRow: 0,
      setInRow: new Set(),
      countAnswerWrong: 0,
      namesAnswerWrong: [],
      namesAnswerWrongTranslate: [],
      namesAnswerWrongSound: [],
      score: 0,
      newWords: 0,
    };

    const textBook: HTMLElement | null = document.querySelector('#textBook');
    if (textBook) textBook.remove();

    const main: HTMLElement | null = document.querySelector('.main');
    if (main && game === 'AudioChalenge') {
      main.innerHTML = '';
      sessionStorage.setItem('view', Views.games);
      const mainGames = document.createElement('div');
      mainGames.classList.add('main__games');
      main.append(mainGames);
      await new AudioChallange(mainGames, this.wordsInGroup, this.currentCountWord, storage).render();
    }
    if (main && game === 'Sprint') {
      main.innerHTML = '';
      sessionStorage.setItem('view', Views.games);
      const mainGames = document.createElement('div');
      mainGames.classList.add('main__games');
      main.append(mainGames);
      await new Sprint(mainGames, this.wordsInGroup, storage, 300).render();
    }
  }
}

export default LayoutTextBook;
