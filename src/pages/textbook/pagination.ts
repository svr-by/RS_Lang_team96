import Svg from './svg';
import LayoutTextBook from './layoutTextBook';
import { storageService } from '../../shared/services/storageService';

class Pagination {
  private readonly pagination: HTMLDivElement;
  private svg: Svg;
  private layoutTextBook: LayoutTextBook;
  private textBook: HTMLElement;
  constructor(textBook: HTMLElement) {
    this.textBook = textBook;
    this.svg = new Svg();
    this.layoutTextBook = new LayoutTextBook();
    this.pagination = document.createElement('div');
    this.pagination.className = 'pagination';
    this.render();
    this.pagination.addEventListener('click', (event) => {
      this.newPage(event);
    });
  }

  newPage(event: MouseEvent) {
    event.stopPropagation();
    const count: number | null = storageService.getSession('pageNumber');

    if (count !== null) {
      if ((event.target as HTMLElement).id === 'pagination-arrow-left' && count > 0) {
        storageService.setSession('pageNumber', +count - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-first') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if (
        (event.target as HTMLElement).id === 'pagination-second' &&
        (event.target as HTMLElement).innerText !== '...'
      ) {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-third') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-fourth') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-fifth') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-six' && (event.target as HTMLElement).innerText !== '...') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if ((event.target as HTMLElement).id === 'pagination-seven') {
        storageService.setSession('pageNumber', +(event.target as HTMLElement).innerText - 1);
      }
      if (
        ((event.target as HTMLElement).id === 'pagination-arrow-right' ||
          ((event.target as HTMLElement).parentElement as HTMLElement).id === 'pagination-arrow-right') &&
        count < 29
      ) {
        storageService.setSession('pageNumber', +count + 1);
      }
    }

    if ((event.target as HTMLElement).innerText !== '...') this.render();
    const group = JSON.parse(sessionStorage.getItem('level') as string);
    const newPage: number | null = storageService.getSession('pageNumber');
    (newPage || newPage === 0) &&
      (event.target as HTMLElement).innerText !== '...' &&
      this.layoutTextBook.addWords(newPage, group, this.textBook);
  }

  render() {
    this.pagination.innerHTML = '';
    const count: number | null = storageService.getSession('pageNumber');
    if (count !== null) {
      if (+count < 4) {
        this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', +count !== 0 ? 'pagination__arrow-left' : 'left-inactive', 'pagination-arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page' id='pagination-second'>2</p>
      <p class='pagination__page' id='pagination-third'>3</p>
      <p class='pagination__page' id='pagination-fourth'>4</p>
      <p class='pagination__page' id='pagination-fifth'>5</p>
      <p class='pagination__page' id='pagination-six'>...</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg('grey', 'pagination__arrow-right', 'pagination-arrow-right')}
    `;
      } else if (+count >= 4 && +count < 26) {
        this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', 'pagination__arrow-left', 'pagination-arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page no-page' id='pagination-second'>...</p>
      <p class='pagination__page' id='pagination-third'>${count}</p>
      <p class='pagination__page' id='pagination-fourth'>${count + 1}</p>
      <p class='pagination__page' id='pagination-fifth'>${count + 2}</p>
      <p class='pagination__page no-page' id='pagination-six'>...</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg('grey', 'pagination__arrow-right', 'pagination-arrow-right')}
    `;
      } else if (+count >= 26) {
        this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', 'pagination__arrow-left', 'pagination-arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page' id='pagination-second'>...</p>
      <p class='pagination__page' id='pagination-third'>26</p>
      <p class='pagination__page' id='pagination-fourth'>27</p>
      <p class='pagination__page' id='pagination-fifth'>28</p>
      <p class='pagination__page' id='pagination-six'>29</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg(
        'grey',
        +count !== 29 ? 'pagination__arrow-right' : 'right-inactive',
        'pagination-arrow-right'
      )}
    `;
      }
      this.highlightPage();
    } else {
      throw new Error('Count not a number');
    }
  }

  highlightPage() {
    const count: number | null = storageService.getSession('pageNumber');
    if (count !== null) {
      (this.textBook.querySelectorAll('.pagination__page') as unknown as HTMLElement[]).forEach((item) => {
        if (+item.innerText === +count + 1) {
          item.classList.add('selected-page');
        } else {
          item.classList.remove('selected-page');
        }
      });
    } else {
      throw new Error('count not a number');
    }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.pagination);
    this.highlightPage();
  }
}

export default Pagination;
