import { layoutService } from '../shared/services/layoutService';
import { Header } from '../shared/components/header';
import { Footer } from '../shared/components/footer';
import { Views } from '../shared/enums';
import StartPage from '../pages/start';
import Games from '../pages/games/games';
import LayoutTextBook from '../pages/textbook/layoutTextBook';
import DevsPage from '../pages/developers';

class App {
  header: Header;
  footer: Footer;
  main: HTMLElement;
  startPage: StartPage;
  private layoutTextBook: LayoutTextBook;
  devsPage: DevsPage;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.main = layoutService.createElement({ tag: 'main', classes: ['main'] });
    this.startPage = new StartPage();
    this.layoutTextBook = new LayoutTextBook();
    this.devsPage = new DevsPage();
    this.renderMain();
  }

  render() {
    document.body.append(this.header.elem);
    document.body.append(this.main);
    document.body.append(this.footer.elem);
  }

  async renderMain() {
    this.main.innerHTML = '';
    const view = sessionStorage.getItem('view');
    let mainContent: HTMLElement | undefined;
    switch (view) {
      case Views.textbook:
        mainContent = await this.layoutTextBook.renderTextBook();
        break;
      case Views.games:
        mainContent = new Games(this.main).render();
        break;
      case Views.statistics:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница со статистикой' });
        break;
      case Views.developers:
        mainContent = this.devsPage.render();
        break;
      case Views.video:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница с видеообзором' });
        break;
      case Views.start:
      default:
        mainContent = this.startPage.render();
        break;
    }
    this.main.append(mainContent as HTMLElement);
  }
}

export const app = new App();
