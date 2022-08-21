import Games from './games/games';

class App {
  main: HTMLElement;

  constructor() {
    this.main = document.createElement('div');
  }

  async render() {
    document.body.appendChild(this.main);
    this.main.classList.add('main');

    new Games(this.main).render();
  }
}

export default App;
