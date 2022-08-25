import Svg from '../textBookSvg/svg';
import LayoutTextBook from './layoutTextBook';

class Pagination {
  private readonly pagination: HTMLDivElement;
  private svg: Svg;
  private layoutTextBook: LayoutTextBook;
  constructor() {
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
    const count = JSON.parse(sessionStorage.getItem('pageNumber') as string);
    if ((event.target as HTMLElement).id === 'pagination-arrow-left' && count > 1) {
      sessionStorage.setItem('pageNumber', JSON.stringify(count - 1));
    }
    if ((event.target as HTMLElement).id === 'pagination-first') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-second' && (event.target as HTMLElement).innerText !== '...') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-third') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-fourth') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-fifth') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-six' && (event.target as HTMLElement).innerText !== '...') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-seven') {
      sessionStorage.setItem('pageNumber', (event.target as HTMLElement).innerText);
    }
    if ((event.target as HTMLElement).id === 'pagination-arrow-right' && count < 30) {
      sessionStorage.setItem('pageNumber', JSON.stringify(count + 1));
    }
    this.render();
    const group = JSON.parse(sessionStorage.getItem('level') as string);
    const newPage = JSON.parse(sessionStorage.getItem('pageNumber') as string);
    this.layoutTextBook.addWords(newPage, group);
  }

  render() {
    this.pagination.innerHTML = '';
    const count = JSON.parse(sessionStorage.getItem('pageNumber') as string);
    if (count < 5) {
      this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', count !== 1 ? 'pagination__arrow-left' : 'left-inactive', 'pagination-arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page' id='pagination-second'>2</p>
      <p class='pagination__page' id='pagination-third'>3</p>
      <p class='pagination__page' id='pagination-fourth'>4</p>
      <p class='pagination__page' id='pagination-fifth'>5</p>
      <p class='pagination__page' id='pagination-six'>...</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg('grey', 'pagination__arrow-right', 'pagination-arrow-right')}
    `;
    } else if (count >= 5 && count < 27) {
      this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', 'pagination__arrow-left', 'pagination-arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page no-page' id='pagination-second'>...</p>
      <p class='pagination__page' id='pagination-third'>${count - 1}</p>
      <p class='pagination__page' id='pagination-fourth'>${count}</p>
      <p class='pagination__page' id='pagination-fifth'>${count + 1}</p>
      <p class='pagination__page no-page' id='pagination-six'>...</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg('grey', 'pagination__arrow-right', 'pagination-arrow-right')}
    `;
    } else if (count >= 27) {
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
        count !== 30 ? 'pagination__arrow-right' : 'right-inactive',
        'pagination-arrow-right'
      )}
    `;
    }
    this.highlightPage();
  }

  highlightPage() {
    const count = JSON.parse(sessionStorage.getItem('pageNumber') as string);
    (document.querySelectorAll('.pagination__page') as unknown as HTMLElement[]).forEach((item) => {
      if (item.innerText == count) {
        item.classList.add('selected-page');
      } else {
        item.classList.remove('selected-page');
      }
    });
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.pagination);
    this.highlightPage();
  }
}

export default Pagination;
