import { layoutService } from '../../services/layoutService';

export class Footer {
  elem: HTMLElement;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'footer', classes: ['footer'] });
    this.render();
  }

  render() {
    const wrapper = layoutService.createElement({ tag: 'div', classes: ['wrapper', 'wrapper-footer'] });
    wrapper.innerHTML = `   
      <div class="footer__copyright">© 2022 RSLang</div>
      <ul class="github__list">
        <li class="github__item">
          <a href="https://github.com/brombom" class="github__link">Igor</a>
        </li>
        <li class="github__item">
          <a href="https://github.com/denis169" class="github__link">Denis</a>
        </li>
        <li class="github__item">
          <a href="https://github.com/svr-by" class="github__link">Sergey</a>
        </li>
        <li class="github__item">
          <a href="https://github.com/CatherineShemenkova" class="github__link">Catherine</a>
        </li>
      </ul>      
      <div class="rss">
        <a href="https://rs.school/js/">
            <img src="assets/img/rs_school_js.svg" alt="RSSchool"  class="rss__img">
        </a>
      </div>
    `;
    this.elem.append(wrapper);
  }
}
