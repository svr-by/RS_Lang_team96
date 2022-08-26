import { layoutService } from '../shared/services/layoutService';
import { Header } from '../shared/components/header';
import { Footer } from '../shared/components/footer';
import { Views } from '../shared/enums';
import { StartPage } from '../pages/start';

class App {
  header: Header;
  footer: Footer;
  main: HTMLElement;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.main = layoutService.createElement({ tag: 'main', classes: ['main'] });
    this.renderMain();
  }

  render() {
    document.body.append(this.header.elem);
    document.body.append(this.main);
    document.body.append(this.footer.elem);
  }

  renderMain() {
    this.main.innerHTML = '';
    const view = sessionStorage.getItem('view');
    let mainContent;
    switch (view) {
      case Views.textbook:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница с учеником' });
        break;
      case Views.games:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница с играми' });
        break;
      case Views.statistics:
        mainContent = layoutService.createElement({ tag: 'h1', text: 'Страница статистики' });
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
    this.main.append(mainContent);
  }
}

export const app = new App();
