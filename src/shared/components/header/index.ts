import { Authorization } from '../../../pages/authorization';
import { layoutService } from '../../services/layoutService';
import { navigationService } from '../../services/navigationService';
import { userService } from '../../services/userService';
import { NavLinks } from '../../enums';
import { Button } from '../button';

export class Header {
  elem: HTMLElement;
  loginElem: HTMLElement;
  loginWindow: Authorization;
  loginBtn: Button;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'header', classes: ['header'] });
    this.loginElem = layoutService.createElement({ tag: 'div', classes: ['login'] });
    this.loginBtn = new Button('Войти', ['login__btn', 'button']);
    this.loginWindow = new Authorization();
    this.addListeners();
    this.render();
  }

  render() {
    this.elem.innerHTML = '';

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
      </div>
      <div class="burger">
        <div class="line line1"></div>
        <div class="line line2"></div>
        <div class="line line3"></div>
      </div>
      <div class="background"></div>
    `;

    this.renderloginElem();
    wrapper.append(this.loginElem);
    this.elem.append(wrapper);
  }

  renderloginElem() {
    this.loginElem.innerHTML = '';

    const userName = userService.getStoredUserName();
    const nameElem = layoutService.createElement({ tag: 'div', text: userName, classes: ['login__name'] });
    this.loginElem.append(nameElem);

    if (!userName) {
      this.loginBtn.updateText('Войти');
      this.loginBtn.elem.id = 'logInBtn';
    } else {
      this.loginBtn.updateText('Выйти');
      this.loginBtn.elem.id = 'logOutBtn';
    }
    this.loginElem.append(this.loginBtn.elem);
  }

  private addListeners() {
    function toggleMenu() {
      const burger = document.querySelector('.burger') as HTMLElement;
      const nav = document.querySelector('.nav') as HTMLElement;
      const background = document.querySelector('.background') as HTMLElement;
      burger.classList.toggle('open');
      nav.classList.toggle('open');
      background.classList.toggle('visible');
      document.body.classList.toggle('noscroll');
    }

    function closeMenu() {
      const burger = document.querySelector('.burger') as HTMLElement;
      const nav = document.querySelector('.nav') as HTMLElement;
      const background = document.querySelector('.background') as HTMLElement;
      burger.classList.remove('open');
      nav.classList.remove('open');
      background.classList.remove('visible');
      document.body.classList.remove('noscroll');
    }

    this.loginBtn.elem.addEventListener('click', () => {
      if (this.loginBtn.elem.id === 'logInBtn') {
        this.loginWindow.render();
      }
      if (this.loginBtn.elem.id === 'logOutBtn') {
        userService.signOut();
      }
    });

    this.elem.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('logo__img')) {
        event.preventDefault();
        navigationService.followLink(NavLinks.start);
        closeMenu();
      }

      if (target.classList.contains('nav__link')) {
        event.preventDefault();
        navigationService.followLink(target.id);
        closeMenu();
      }

      if (target.closest('.burger')) {
        toggleMenu();
      }
    });

    window.addEventListener('resize', () => {
      const burger = document.querySelector('.burger') as HTMLElement;
      if (burger && burger.classList.contains('open')) {
        closeMenu();
      }
    });
  }
}
