import { layoutService } from '../../services/layoutService';

export class Preloader {
  elem: HTMLElement;

  constructor(isFullScreen = false) {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['preloader'] });
    if (isFullScreen) this.elem.classList.add('preloader--full');
    this.elem.innerHTML = `
      <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>
    `;
  }
}
