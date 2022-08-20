import Svg from '../textBookSvg/svg';
import Level from './level';

class LayoutTextBook {
  private svg: Svg;
  private groopNumber: { name: string; numbers: string; id: string }[];
  constructor() {
    this.svg = new Svg();
    this.groopNumber = [
      {
        name: 'Easy',
        numbers: '1-600',
        id: 'A1',
      },
      {
        name: 'Easy',
        numbers: '601-1200',
        id: 'A2',
      },
      {
        name: 'Medium',
        numbers: '1201-1800',
        id: 'B1',
      },
      {
        name: 'Medium',
        numbers: '1801-2400',
        id: 'B2',
      },
      {
        name: 'Hard',
        numbers: '2401-3000',
        id: 'C1',
      },
      {
        name: 'Hard',
        numbers: '3001-3600',
        id: 'C2',
      },
    ];
  }
  renderTextBook() {
    const parentBook = document.querySelector('body') as HTMLElement;
    const textBook = document.createElement('section') as HTMLElement;
    textBook.className = 'textBook';
    textBook.innerHTML = `
      <div class='header-and-settings'>
        <h2 class='header'>Учебник</h2>
        ${this.svg.settingsSvg('#98fc03', 'settings')}
      </div>
      <div class='levels' id='levels'></div>
      <div class='words'>
        <div class='word__value'></div>
        <div class='words__description'></div>
      </div>
      <div class='pagination'></div>
      <div class='games'>
        <h2 class='games__header'>Игры</h2>
        <p class='games__description'>Закрепи новые слова при помощи игр</p>
        <div class='games__links'></div>
      </div>
    `;
    parentBook.append(textBook);

    const levels = document.getElementById('levels') as HTMLElement;
    this.groopNumber.forEach((item) => {
      console.log(123);
      new Level(item.name, item.numbers, item.id).appendTo(levels);
    });
  }
}

export default LayoutTextBook;
