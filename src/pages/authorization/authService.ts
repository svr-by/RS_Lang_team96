import { User, UserParams } from '../../shared/types';
import API from '../../api';

class AuthService {
  async signin() {
    const userEmailInput = document.querySelector('#userEmailInput') as HTMLInputElement;
    const userPassInput = document.querySelector('#userPassInput') as HTMLInputElement;
    const formFieldError = document.querySelector('#formFieldError') as HTMLElement;

    const userParams: UserParams = {
      email: userEmailInput.value,
      password: userPassInput.value,
    };

    const result = await new API().signIn(userParams);

    if (result) {
      if (typeof result === 'string') {
        formFieldError.innerHTML = result;
      } else {
        //обновить header
        return true;
      }
    }
  }

  async registration() {
    const userNameInput = document.querySelector('#userNameInput') as HTMLInputElement;
    const userEmailInput = document.querySelector('#userEmailInput') as HTMLInputElement;
    const userPassInput = document.querySelector('#userPassInput') as HTMLInputElement;
    const formFieldError = document.querySelector('#formFieldError') as HTMLElement;

    const user: User = {
      name: userNameInput.value,
      email: userEmailInput.value,
      password: userPassInput.value,
    };

    const userParams: UserParams = {
      email: userEmailInput.value,
      password: userPassInput.value,
    };

    const result = await new API().createUser(user);

    if (result) {
      if (typeof result === 'string') {
        formFieldError.innerHTML = result;
      } else {
        await new API().signIn(userParams);
        //обновить header
        return true;
      }
    }
  }
}

export const authService = new AuthService();
