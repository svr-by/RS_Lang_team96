import Svg from '../textBookSvg/svg';

class Pagination {
  private readonly pagination: HTMLDivElement;
  private svg: Svg;
  constructor() {
    this.svg = new Svg();
    this.pagination = document.createElement('div');
    this.pagination.innerHTML = `
      ${this.svg.arrowSvg('grey', 'pagination__arrow-left')}
      <p class='pagination__page' id='pagination-first'>1</p>
      <p class='pagination__page' id='pagination-second'>2</p>
      <p class='pagination__page' id='pagination-third'>3</p>
      <p class='pagination__page' id='pagination-fourth'>4</p>
      <p class='pagination__page' id='pagination-fifth'>5</p>
      <p class='pagination__page' id='pagination-six'>...</p>
      <p class='pagination__page' id='pagination-seven'>30</p>
      ${this.svg.arrowSvg('grey', 'pagination__arrow-right')}
    `;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.pagination);
  }
}

export default Pagination;
