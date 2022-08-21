import { layoutService } from '../../services/layoutService';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';

export class MainPage {
  elem: HTMLElement;
  header: Header;
  footer: Footer;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['main-page'] });
    this.header = new Header();
    this.footer = new Footer();
  }

  render() {
    this.elem.append(this.header.elem);
    const main = layoutService.createElement({ tag: 'main', classes: ['main'] });
    this.elem.append(main);
    this.elem.append(this.footer.elem);
    document.body.append(this.elem);
  }
}
