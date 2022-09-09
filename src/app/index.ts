import { layoutService } from '../shared/services/layoutService';
import { userApiService } from '../api/userApiService';
import { Header } from '../shared/components/header';
import { Footer } from '../shared/components/footer';
import { Views } from '../shared/enums';
import StartPage from '../pages/start';
import Games from '../pages/games/games';
import LayoutTextBook from '../pages/textbook/layoutTextBook';
import DevsPage from '../pages/developers';
import StatsPage from '../pages/statistics';
import VideoPage from '../pages/video';

class App {
  header: Header;
  footer: Footer;
  main: HTMLElement;
  startPage: StartPage;
  textBook: LayoutTextBook;
  games: Games;
  devsPage: DevsPage;
  statsPage: StatsPage;
  videoPage: VideoPage;

  constructor() {
    this.main = layoutService.createElement({ tag: 'main', classes: ['main'] });
    this.header = new Header();
    this.footer = new Footer();
    this.startPage = new StartPage();
    this.textBook = new LayoutTextBook();
    this.games = new Games();
    this.devsPage = new DevsPage();
    this.statsPage = new StatsPage();
    this.videoPage = new VideoPage();
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
        mainContent = await this.textBook.renderTextBook();
        this.footer.elem.hidden = false;
        break;
      case Views.games:
        mainContent = this.games.render();
        this.footer.elem.hidden = true;
        break;
      case Views.statistics:
        mainContent = this.statsPage.render();
        this.footer.elem.hidden = false;
        break;
      case Views.developers:
        mainContent = this.devsPage.render();
        this.footer.elem.hidden = false;
        break;
      case Views.video:
        mainContent = this.videoPage.render();
        this.footer.elem.hidden = false;
        break;
      case Views.start:
      default:
        mainContent = this.startPage.render();
        userApiService.getNewTokens();
        this.footer.elem.hidden = false;
        break;
    }
    this.main.append(mainContent as HTMLElement);
  }
}

export const app = new App();
