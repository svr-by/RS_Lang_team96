import Svg from '../textBookSvg/svg';
import Level from './level';
import { dataLevels } from './levelsEnglishData';
import Words from '../api/words';
import { WordType } from '../types';
import Pagination from './pagination';
import Description from './description';
import Word from './word';

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
    textBook.innerHTML = `
      <div class='header-and-settings'>
        <h2 class='header-and-settings__header'>Учебник</h2>
        ${this.svg.settingsSvg('#98fc03', 'settings')}
      </div>
      <div class='levels' id='levels'></div>
      <div class='words'>
        <h2 class='levels__header'>Слова</h2>
        <div class='word__value' id='words'></div>
        <div class='words__description' id='description'></div>
      </div>
      <div class='pagination' id='pagination'></div>
      <div class='games'>
        <h2 class='games__header'>Игры</h2>
        <p class='games__description'>Закрепи новые слова при помощи игр</p>
        <div class='games__links'></div>
      </div>
    `;
    parentBook.append(textBook);

    const levels = document.getElementById('levels') as HTMLElement;
    this.groupNumber.forEach((item, index) => {
      new Level(item.name, item.numbers, item.id, index).appendTo(levels);
    });

    const pagination = document.getElementById('pagination') as HTMLElement;
    new Pagination().appendTo(pagination);

    this.addWords(1, 0);

    const description = document.getElementById('description') as HTMLElement;
    await this.description.appendTo(description, '5e9f5ee35eb9e72bc21af4b4');

    (document.getElementById('playSvg') as HTMLElement).addEventListener('click', () => {
      (document.getElementById('sound') as HTMLAudioElement).play();
    });
  }

  addWords(page: number, group: number) {
    const words = document.getElementById('words') as HTMLElement;
    words.innerHTML = '';
    this.words.getWords(page, group).then((data) => {
      data.forEach((item: WordType) => {
        new Word(item.id, item.word, item.wordTranslate).appendTo(words);
      });
    });
  }
}

export default LayoutTextBook;
