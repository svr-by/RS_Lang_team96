import { MainPage } from '../pages/main';

class App {
  mainPage = new MainPage();

  render() {
    console.log('Hello from App');
    this.mainPage.render();
  }
}

export default App;
