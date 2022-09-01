import Svg from './svg';
import Level from './level';
import { dataLevels } from './levelsEnglishData';
import Pagination from './pagination';
import Description from './description';
import Word from './word';
import SettingsModal from './settingsModal';
import { IAggregatedWord, IWord } from '../../shared/interfaces';
import API from '../../api';
import Storage from '../../shared/services/storage';
import LocalStorage from '../../shared/services/localStorage';
// import { LocalUser } from '../../shared/types';

class LayoutTextBook {
  private svg: Svg;
  private groupNumber: { name: string; numbers: string; id: string }[];
  private description: Description;
  private API: API;
  private storage: Storage;
  private localStorage: LocalStorage;

  constructor() {
    this.svg = new Svg();
    this.storage = new Storage();
    this.localStorage = new LocalStorage();
    this.groupNumber = dataLevels;
    this.API = new API();
    this.description = new Description();
  }

  async renderTextBook() {
    const textBook = document.createElement('section');
    textBook.className = 'textBook';
    textBook.id = 'textBook';
    textBook.innerHTML = `
      <div class='wrapper'>
        <div class='header-and-settings' id='header-and-settings'>
          <h2 class='header-and-settings__header' id='textbook-words'>Учебник</h2>
          <h2 class='${
            this.localStorage.get('user') ? 'header-and-settings__header' : 'display-none'
          }' id='difficult-words'>Сложные слова</h2>
          <h2 class='${
            this.localStorage.get('user') ? 'header-and-settings__header' : 'display-none'
          }' id='studied-words'>Изученные слова</h2>
          ${this.svg.settingsSvg('#ffef4f', 'header-and-settings__settings', 'settings')}
        </div>
        <h3 class='levels-header'>Уровни сложности слов</h3>
        <div class='levels' id='levels'></div>
        <div class='words'>
          <h2 class='words__header'>Слова</h2>
          <div class='dictionary'>
            <div class='dictionary__value' id='words'></div>
            <div class='dictionary__description' id='description'></div>
          </div>
        </div>
        <div class='page-navigation' id='pagination'></div>
        <div class='games'>
          <h2 class='games__header'>Игры</h2>
          <p class='games__description'>Закрепи новые слова при помощи игр</p>
          <div class='games__links'></div>
        </div>
      </div>
    `;

    if (!this.storage.get('level')) {
      this.storage.set('level', '0');
    }

    if (!this.storage.get('pageNumber')) {
      this.storage.set('pageNumber', '0');
    }

    if (!this.storage.get('sect')) {
      this.storage.set('sect', 'text-book');
    }

    this.highlightSelectedPartition(textBook);

    if (this.storage.get('sect') === 'text-book') await this.addLevels(textBook);
    if (this.storage.get('sect') === 'difficult words') this.addDifficultWords(textBook);
    if (this.storage.get('sect') === 'studied words') this.addTextbookWords(textBook);

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

    return textBook;
  }

  modeSwitching(event: MouseEvent, textBook: HTMLElement) {
    if (event.target instanceof Element) {
      if (event.target.parentElement instanceof Element)
        if (event.target.parentElement.id === 'settings') this.addSettings(textBook);

      if (event.target.id === 'textbook-words') this.addLevels(textBook);

      if (event.target.id === 'difficult-words') this.addDifficultWords(textBook);

      if (event.target.id === 'studied-words') this.addTextbookWords(textBook);
    }
  }

  addDifficultWords(textBook: HTMLElement) {
    this.storage.set('sect', 'difficult words');
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels');
    if (levels) {
      levels.innerHTML = '';
    }
    const words = textBook.querySelector('#words') as HTMLElement;
    words.innerHTML = 'Сложные слова';
  }

  addTextbookWords(textBook: HTMLElement) {
    this.storage.set('sect', 'studied words');
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels');
    if (levels) {
      levels.innerHTML = '';
    }
    const words = textBook.querySelector('#words') as HTMLElement;
    words.innerHTML = 'Изученные слова';
  }

  addLevels(textBook: HTMLElement) {
    this.storage.set('sect', 'text-book');
    this.highlightSelectedPartition(textBook);
    const levels = textBook.querySelector('#levels') as HTMLElement;
    this.groupNumber.forEach((item, index) => {
      new Level(item.name, item.numbers, item.id, index, textBook).appendTo(levels);
    });
  }

  addWords(page: number, group: number, textBook: HTMLElement) {
    const words = textBook.querySelector('#words') as HTMLElement;
    words.innerHTML = '';

    if (this.localStorage.get('user')) {
      this.API.getAggregatedWords('630c2e10a22d8d0016318977', {
        filter: '{+"$and":+[{+"page":+0+},+{"group":+0}]+}&wordsPerPage=20',
      }).then((data) => {
        if (typeof data === 'string') {
          console.log(data);
        }
        if (Array.isArray(data)) {
          const wordsData = data[0].paginatedResults;
          wordsData.forEach((item: IAggregatedWord, index: number) => {
            if (index === 0) {
              const description = textBook.querySelector('#description') as HTMLElement;
              this.description.appendTo(description, item._id);
              this.storage.set('chosenWordId', item._id);
            }
            new Word(item._id, item.word, item.wordTranslate).appendTo(words);
          });
        }
      });
    } else {
      this.API.getWords(group, page).then((data) => {
        if (typeof data === 'string') {
          console.log(data);
        }
        if (Array.isArray(data)) {
          data.forEach((item: IWord, index: number) => {
            if (index === 0) {
              const description = textBook.querySelector('#description') as HTMLElement;
              this.description.appendTo(description, item.id);
              this.storage.set('chosenWordId', item.id);
            }
            new Word(item.id, item.word, item.wordTranslate).appendTo(words);
          });
        }
      });
    }
  }

  highlightSelectedPartition(textBook: HTMLElement) {
    const textbookWords: HTMLElement | null = textBook.querySelector('#textbook-words');
    const difficultWords: HTMLElement | null = textBook.querySelector('#difficult-words');
    const studiedWords: HTMLElement | null = textBook.querySelector('#studied-words');

    if (textbookWords !== null && difficultWords !== null && studiedWords !== null) {
      this.storage.get('sect') === 'text-book'
        ? (textbookWords.style.color = '#000000')
        : (textbookWords.style.color = '');

      this.storage.get('sect') === 'difficult words'
        ? (difficultWords.style.color = '#000000')
        : (difficultWords.style.color = '');

      this.storage.get('sect') === 'studied words'
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
      false
    );
  }
}

export default LayoutTextBook;
