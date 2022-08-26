import { layoutService } from '../../shared/services/layoutService';
import { Modal } from '../../shared/components/modal';
import { authService } from './authService';

export class Authorization {
  elem: HTMLElement;
  modal: Modal;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['authorization'] });
    this.modal = new Modal();
    this.renderSigninForm();
  }

  private renderSigninForm() {
    this.elem.innerHTML = `
      <form class="auth-form">
        <h2 class="auth-form__title">Вход в аккаунт</h2>
        <p class="auth-form__message">Вы получите доступ к прогрессу изучения слов, разделу "Сложные слова" и статистике.</p>
        <div class="auth-form__fields">
          <input id="userEmailInput" class="auth-form__input" type="email" placeholder="E-mail" required="">
          <input id="userPassInput" class="auth-form__input" type="password" placeholder="Пароль" required="" minlength="8">
        </div>
        <p id="formFieldError" class="auth-form__error"></p>
        <button id="signinBtn" class="button auth-form__btn">Войти</button>
        <a id="registrLink" class="auth-form__link" href="">Регистрация аккаунта</a>
      </form>
    `;
    this.addListeners();
  }

  private renderRegistrForm() {
    this.elem.innerHTML = `
      <form class="auth-form">
        <h2 class="auth-form__title">Регистрация аккаунта</h2>
        <p class="auth-form__message">Вы получите доступ к прогрессу изучения слов, разделу "Сложные слова" и статистике.</p>
        <div class="auth-form__fields">
          <input id="userNameInput" class="auth-form__input" type="text" placeholder="Имя" required="">
          <input id="userEmailInput" class="auth-form__input" type="email" placeholder="E-mail" required="">
          <input id="userPassInput" class="auth-form__input" type="password" placeholder="Пароль" required="" minlength="8">
        </div>
        <p id="formFieldError" class="auth-form__error"></p>
        <button id="registrBtn" class="button auth-form__btn">Регистрация</button>
        <a id="signinLink" class="auth-form__link" href="">Войти в аккаунт</a>
      </form>
    `;
    this.addListeners();
  }

  show() {
    this.modal.showModal(this.elem);
  }

  private addListeners() {
    const registrLink = this.elem.querySelector('#registrLink');
    if (registrLink) {
      registrLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.renderRegistrForm();
      });
    }

    const signinLink = this.elem.querySelector('#signinLink');
    if (signinLink) {
      signinLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.renderSigninForm();
      });
    }

    const signinBtn = this.elem.querySelector('#signinBtn');
    if (signinBtn) {
      signinBtn.addEventListener('click', async (event) => {
        const userEmailInput = this.elem.querySelector('#userEmailInput') as HTMLInputElement;
        const userPassInput = this.elem.querySelector('#userPassInput') as HTMLInputElement;
        if (userEmailInput.validity.valid && userPassInput.validity.valid) {
          event.preventDefault();
          const isSigned = await authService.signin();
          if (isSigned) this.modal.removeModal();
        }
      });
    }

    const registrBtn = this.elem.querySelector('#registrBtn');
    if (registrBtn) {
      registrBtn.addEventListener('click', async (event) => {
        const userNameInput = this.elem.querySelector('#userNameInput') as HTMLInputElement;
        const userEmailInput = this.elem.querySelector('#userEmailInput') as HTMLInputElement;
        const userPassInput = this.elem.querySelector('#userPassInput') as HTMLInputElement;
        if (userNameInput.validity.valid && userEmailInput.validity.valid && userPassInput.validity.valid) {
          event.preventDefault();
          const isRegistered = await authService.signin(); //исправить
          if (isRegistered) this.modal.removeModal();
        }
      });
    }
  }
}
