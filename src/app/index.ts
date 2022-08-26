// import { MainPage } from '../pages/main';
import LayoutTextBook from '../pages/textbook/layoutTextBook';

class App {
  // mainPage = new MainPage();
  layoutTextBook = new LayoutTextBook();

  render() {
    this.layoutTextBook.renderTextBook();
  }
}

export default App;
