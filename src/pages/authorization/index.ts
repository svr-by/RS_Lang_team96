import { layoutService } from '../../shared/services/layoutService';
import { userService } from '../../shared/services/userService';
import { Modal } from '../../shared/components/modal';

export class Authorization {
  elem: HTMLElement;
  modal: Modal;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'form', classes: ['auth-form'], id: 'authForm' });
    this.modal = new Modal();
    this.addFormListeners();
  }

  render() {
    this.renderSigninForm();
    this.modal.showModal(this.elem);
  }

  private renderSigninForm() {
    this.elem.innerHTML = `
        <h2 class="auth-form__title">Вход в аккаунт</h2>
        <p class="auth-form__message">Вы получите доступ к прогрессу изучения слов, разделу "Сложные слова" и статистике.</p>
        <div class="auth-form__fields">
          <input name="email" class="auth-form__input" type="email" placeholder="E-mail" required="">
          <input name="pass" class="auth-form__input" type="password" placeholder="Пароль" required="" minlength="8">
        </div>
        <p id="formFieldError" class="auth-form__error"></p>
        <input type="submit" class="button auth-form__btn"  id="authBtn" data-func="login" value="Войти"/>
        <a id="registrLink" class="auth-form__link" href="">Регистрация аккаунта</a>
    `;
    this.addLinkListeners();
  }

  private renderRegistrForm() {
    this.elem.innerHTML = `
        <h2 class="auth-form__title">Регистрация аккаунта</h2>
        <p class="auth-form__message">Вы получите доступ к прогрессу изучения слов, разделу "Сложные слова" и статистике.</p>
        <div class="auth-form__fields">
          <input name="userName" class="auth-form__input" type="text" placeholder="Имя" required="">
          <input name="email" class="auth-form__input" type="email" placeholder="E-mail" required="">
          <input name="pass" class="auth-form__input" type="password" placeholder="Пароль" required="" minlength="8">
        </div>
        <p id="formFieldError" class="auth-form__error"></p>
        <input type="submit" class="button auth-form__btn"  id="authBtn" data-func="registr" value="Регистрация"/>
        <a id="signinLink" class="auth-form__link" href="">Войти в аккаунт</a>
    `;
    this.addLinkListeners();
  }

  private addFormListeners() {
    this.elem.addEventListener('submit', async (event) => {
      const button = this.elem.querySelector('#authBtn') as HTMLElement;
      if (button) {
        let isSuccess: boolean;
        switch (button.dataset.func) {
          case 'login':
            event.preventDefault();
            isSuccess = await userService.signIn();
            if (isSuccess) this.modal.closeModal();
            break;
          case 'registr':
            event.preventDefault();
            isSuccess = await userService.registration();
            if (isSuccess) this.modal.closeModal();
            break;
        }
      }
    });
  }

  private addLinkListeners() {
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
  }
}
