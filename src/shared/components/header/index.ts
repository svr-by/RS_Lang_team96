import { layoutService } from '../../services/layoutService';
import { Button } from '../button';

export class Header {
  elem: HTMLElement;
  userName: HTMLElement;
  loginBtn: Button;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'header', classes: ['header'] });
    this.userName = layoutService.createElement({ tag: 'div', classes: ['login__name'] });
    this.loginBtn = new Button('Войти', ['login__btn', 'button']);
    this.render();
  }

  render() {
    const wrapper = layoutService.createElement({ tag: 'div', classes: ['wrapper', 'header__wrapper'] });
    wrapper.innerHTML = `
      <div class="logo">
        <a href="/">
          <img src="assets/img/logo.png" class="logo__img" alt="Logo">
        </a>
      </div>
      <div class="nav">
        <ul class="nav__list">
          <li class="nav__item">
            <a href="/" class="nav__link">Главная</a>
          </li>
          <li class="nav__item">
            <a href="/textbook" class="nav__link">Учебник</a>
          </li>
          <li class="nav__item">
            <a href="/games" class="nav__link">Игры</a>
          </li>
          <li class="nav__item">
            <a href="/statistics" class="nav__link">Статистика</a>
          </li>
          <li class="nav__item">
            <a href="/developers" class="nav__link">Разработчики</a>
          </li>
        </ul>
    `;
    const login = layoutService.createElement({ tag: 'div', classes: ['login'] });
    login.append(this.userName);
    login.append(this.loginBtn.elem);
    wrapper.append(login);
    this.elem.append(wrapper);
  }
}
