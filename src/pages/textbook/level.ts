import layoutTextBook from './layoutTextBook';
import LayoutTextBook from './layoutTextBook';
import Pagination from './pagination';
import { storageService } from '../../shared/services/storageService';

class Level {
  private readonly level: HTMLDivElement;
  private layoutTextBook: LayoutTextBook;
  private pagination: Pagination;
  private textBook: HTMLElement;
  constructor(name: string, numbers: string, id: string, index: number, textBook: HTMLElement) {
    this.textBook = textBook;
    this.pagination = new Pagination(this.textBook);
    this.layoutTextBook = new layoutTextBook();
    this.level = document.createElement('div');
    this.level.classList.add(`level`);
    this.level.classList.add(`${id}`);
    this.level.id = id;
    this.level.innerHTML = `
      <div class="level__name">
        <h2 class='level__header'>${name}</h2>
        <p class='level__word-number'>${numbers}</p>
      </div>
      <p class='level__value' id='value-level'>
        ${id}
      </p>
    `;

    if (index == storageService.getSession('level')) {
      this.changeLevel(id, this.level);
    }

    this.level.addEventListener('click', () => {
      storageService.setSession('pageNumber', '0');
      const pagination = textBook.querySelector('#pagination');
      if (pagination) {
        pagination.innerHTML = '';
        new Pagination(textBook).appendTo(pagination as HTMLElement);
      }
      sessionStorage.setItem('level', JSON.stringify(index));
      this.changeLevel(id, this.level);
    });

    this.level.addEventListener('mouseover', () => {
      this.choseColor(index);
    });

    this.level.addEventListener('mouseout', () => {
      this.removeColor(index);
    });
  }

  changeLevel(id: string, levelElement: HTMLElement) {
    const indexFromStorage = storageService.getSession('level');
    const index = indexFromStorage && Number(storageService.getSession('level'));

    if (typeof index === 'number') {
      const pageNumber: number | null = storageService.getSession('pageNumber');
      pageNumber && this.layoutTextBook.addWords(pageNumber, index, this.textBook);
      this.pagination.highlightPage();
      this.addPermanentColor(index, id);
      levelElement.setAttribute('data-chose', 'true');
      levelElement.style.opacity = '1';
    } else {
      throw new Error('Level index not a number');
    }
  }

  addPermanentColor(index: number, id: string) {
    (document.querySelectorAll('.level') as unknown as HTMLElement[]).forEach((item) => {
      if (item.id !== id) {
        item.classList.remove(`permanent-${item.id.toLowerCase()}`);
        item.removeAttribute('data-chose');
        item.style.opacity = '';
      }
    });

    switch (index) {
      case 0:
        this.level.classList.add('permanent-a1');
        break;
      case 1:
        this.level.classList.add('permanent-a2');
        break;
      case 2:
        this.level.classList.add('permanent-b1');
        break;
      case 3:
        this.level.classList.add('permanent-b2');
        break;
      case 4:
        this.level.classList.add('permanent-c1');
        break;
      case 5:
        this.level.classList.add('permanent-c2');
        break;
    }
  }

  choseColor(index: number) {
    switch (index) {
      case 0:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-a1');
        break;
      case 1:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-a2');
        break;
      case 2:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-b1');
        break;
      case 3:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-b2');
        break;
      case 4:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-c1');
        break;
      case 5:
        (this.level.querySelector('#value-level') as HTMLElement).classList.add('hover-c2');
        break;
    }
  }

  removeColor(index: number) {
    switch (index) {
      case 0:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-a1');
        break;
      case 1:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-a2');
        break;
      case 2:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-b1');
        break;
      case 3:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-b2');
        break;
      case 4:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-c1');
        break;
      case 5:
        (this.level.querySelector('#value-level') as HTMLElement).classList.remove('hover-c2');
        break;
    }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.level);
  }
}

export default Level;
