import { layoutService } from '../shared/services/layoutService';
import { Header } from '../shared/components/header';
import { Footer } from '../shared/components/footer';
import { Views } from '../shared/enums';
import { StartPage } from '../pages/start';
import Statistic from '../pages/statistic/statistic';
import Games from '../pages/games/games';
import LayoutTextBook from '../pages/textbook/layoutTextBook';

class App {
  header: Header;
  footer: Footer;
  main: HTMLElement;
  private layoutTextBook: LayoutTextBook;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.layoutTextBook = new LayoutTextBook();
    this.main = layoutService.createElement({ tag: 'main', classes: ['main'] });
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
        mainContent = await new Statistic(this.main).render();
        break;
      case Views.developers:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Разработчики' });
        break;
      case Views.video:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница с видеообзором' });
        break;
      case Views.start:
      default:
        mainContent = new StartPage().render();
        break;
    }
    this.main.append(mainContent as HTMLElement);
  }
}

export const app = new App();
