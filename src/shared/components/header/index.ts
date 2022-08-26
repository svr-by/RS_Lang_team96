import { Authorization } from '../../../pages/authorization';
import { layoutService } from '../../services/layoutService';
import { navigationService } from '../../services/navigationService';
import { NavLinks } from '../../enums';
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
            <a id="${NavLinks.start}" class="nav__link" href="">Главная</a>
          </li>
          <li class="nav__item">
            <a id="${NavLinks.textbook}" class="nav__link" href="">Учебник</a>
          </li>
          <li class="nav__item">
            <a id="${NavLinks.games}" class="nav__link" href="">Игры</a>
          </li>
          <li class="nav__item">
            <a id="${NavLinks.statistics}" class="nav__link" href="">Статистика</a>
          </li>
          <li class="nav__item">
            <a id="${NavLinks.developers}" class="nav__link" href="">Разработчики</a>
          </li>
        </ul>
    `;
    const login = layoutService.createElement({ tag: 'div', classes: ['login'] });
    login.append(this.userName);
    login.append(this.loginBtn.elem);
    wrapper.append(login);
    this.elem.append(wrapper);
    this.addListeners();
  }

  private addListeners() {
    this.loginBtn.elem.addEventListener('click', () => {
      const logiPage = new Authorization();
      logiPage.show();
    });

    this.elem.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('logo__img')) {
        event.preventDefault();
        navigationService.followLink(NavLinks.start);
      }

      if (target.classList.contains('nav__link')) {
        event.preventDefault();
        navigationService.followLink(target.id);
      }
    });
  }
}
