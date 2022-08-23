import { MainPage } from '../pages/main';

class App {
  mainPage = new MainPage();

  render() {
    this.mainPage.render();
  }
}

export default App;
