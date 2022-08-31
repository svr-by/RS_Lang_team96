import { User, UserParams, SignInResponse } from '../types';
import { app } from '../../app';
import { Modal } from '../components/modal';
import { layoutService } from './layoutService';
import { storageService } from './storageService';
import { userApiService } from '../../api/userApiService';

class UserService {
  getStoredUserId(): string {
    const user = storageService.getLocal<SignInResponse>('user');
    const userId = user ? user.userId : '';
    return userId;
  }

  getStoredUserName(): string {
    const user = storageService.getLocal<SignInResponse>('user');
    const userName = user ? user.name : '';
    return userName;
  }

  async requestUserName() {
    const userid = this.getStoredUserId();
    const userObj = userid ? await userApiService.getUser(userid) : '';
    const userName = typeof userObj === 'object' ? userObj.name : '';
    return userName;
  }

  showAuthorizationMess() {
    const mess = layoutService.createElement({ tag: 'h3', text: 'Пожалуйста авторизуйтесь' });
    new Modal().showModal(mess);
    this.signOut();
  }

  showServerDownMess() {
    const mess = layoutService.createElement({ tag: 'h3', text: 'Ошибка сети' });
    new Modal().showModal(mess);
  }

  signOut() {
    sessionStorage.removeItem('user');
    app.header.renderloginElem();
    app.renderMain();
  }

  async signIn() {
    const form = document.getElementById('authForm') as HTMLFormElement;
    const formErrorMess = document.getElementById('formFieldError') as HTMLElement;

    const userParams: UserParams = {
      email: form?.email?.value || '',
      password: form?.pass?.value || '',
    };

    const result = await userApiService.signIn(userParams);

    if (result) {
      if (typeof result === 'string') {
        formErrorMess.innerHTML = result;
      } else {
        app.header.renderloginElem();
        app.renderMain();
        return true;
      }
    }
    return false;
  }

  async registration() {
    const form = document.getElementById('authForm') as HTMLFormElement;
    const formErrorMess = document.getElementById('formFieldError') as HTMLElement;

    const user: User = {
      name: form?.userName?.value || '',
      email: form?.email?.value || '',
      password: form?.pass?.value || '',
    };

    const userParams: UserParams = {
      email: form?.email?.value || '',
      password: form?.pass?.value || '',
    };

    const result = await userApiService.createUser(user);

    if (result) {
      if (typeof result === 'string') {
        formErrorMess.innerHTML = result;
      } else {
        await userApiService.signIn(userParams);
        app.header.renderloginElem();
        app.renderMain();
        return true;
      }
    }
    return false;
  }
}

export const userService = new UserService();
