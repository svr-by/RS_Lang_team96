import Svg from '../textBookSvg/svg';
import Level from './level';
import { dataLevels } from './levelsEnglishData';
import Words from '../api/words';
import { WordType } from '../types';
import Pagination from './pagination';
import Description from './description';
import Word from './word';
import SettingsModal from './settingsModal';

class LayoutTextBook {
  private svg: Svg;
  private groupNumber: { name: string; numbers: string; id: string }[];
  private words: Words;
  private description: Description;
  constructor() {
    this.svg = new Svg();
    this.groupNumber = dataLevels;
    this.words = new Words();
    this.description = new Description();
  }

  async renderTextBook() {
    const parentBook = document.querySelector('body') as HTMLElement;
    const textBook = document.createElement('section') as HTMLElement;
    textBook.className = 'textBook';
    textBook.id = 'textBook';
    textBook.innerHTML = `
      <div class='header-and-settings'>
        <h2 class='header-and-settings__header'>Учебник</h2>
        ${this.svg.settingsSvg('#ffef4f', 'header-and-settings__settings')}
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
    `;
    parentBook.append(textBook);

    if (!sessionStorage.getItem('level')) {
      sessionStorage.setItem('level', '0');
    }

    await this.addLevels();

    const pagination = document.getElementById('pagination') as HTMLElement;
    if (!sessionStorage.getItem('pageNumber')) {
      console.log(123);
      sessionStorage.setItem('pageNumber', '1');
    }
    new Pagination().appendTo(pagination);

    new SettingsModal().appendTo(textBook);

    (document.getElementById('settings') as HTMLElement).addEventListener('click', (event) => {
      event.stopPropagation();
      this.addSettings();
    });
  }

  addLevels() {
    const levels = document.getElementById('levels') as HTMLElement;
    this.groupNumber.forEach((item, index) => {
      new Level(item.name, item.numbers, item.id, index).appendTo(levels);
    });
  }

  addWords(page: number, group: number) {
    const words = document.getElementById('words') as HTMLElement;
    words.innerHTML = '';
    this.words.getWords(page - 1, group).then((data) => {
      data.forEach((item: WordType, index: number) => {
        if (index === 0) {
          const description = document.getElementById('description') as HTMLElement;
          this.description.appendTo(description, item.id);
          sessionStorage.setItem('chosenWordId', item.id);
        }
        new Word(item.id, item.word, item.wordTranslate).appendTo(words);
      });
    });
  }

  addSettings() {
    (document.getElementById('settings-modal') as HTMLElement).classList.remove('display-none');
    (document.getElementById('toggle') as HTMLInputElement).addEventListener('change', (event) => {
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
