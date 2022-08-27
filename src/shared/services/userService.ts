import { User, UserParams, SignInResponse } from '../types';
import { app } from '../../app';
import API from '../../api';

class UserService {
  api = new API();

  getStoredUserId() {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : '';
    const userId = userObj ? userObj.userId : '';
    return userId;
  }

  getStoredUserName() {
    const userStr = localStorage.getItem('user');
    const userObj: SignInResponse = userStr ? JSON.parse(userStr) : '';
    const userName = userObj ? userObj.name : '';
    return userName;
  }

  clearStoredUser() {
    localStorage.removeItem('user');
  }

  async requestUserName() {
    const userid = this.getStoredUserId();
    const userObj = userid ? await this.api.getUser(userid) : '';
    const userName = typeof userObj === 'object' ? userObj.name : '';
    return userName;
  }

  async signIn() {
    const form = document.getElementById('authForm') as HTMLFormElement;
    const formErrorMess = document.getElementById('formFieldError') as HTMLElement;

    const userParams: UserParams = {
      email: form?.email?.value || '',
      password: form?.pass?.value || '',
    };

    const result = await this.api.signIn(userParams);

    if (result) {
      if (typeof result === 'string') {
        formErrorMess.innerHTML = result;
      } else {
        app.header.renderloginElem();
        return true;
      }
    } else {
      formErrorMess.innerHTML = 'Извините, непредвиденная ошибка.';
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

    const result = await this.api.createUser(user);

    if (result) {
      if (typeof result === 'string') {
        formErrorMess.innerHTML = result;
      } else {
        await this.api.signIn(userParams);
        app.header.renderloginElem();
        return true;
      }
    } else {
      formErrorMess.innerHTML = 'Извините, непредвиденная ошибка.';
    }
    return false;
  }
}

export const userService = new UserService();
