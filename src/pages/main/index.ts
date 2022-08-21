import { layoutService } from '../../services/layoutService';
import { Header } from '../../components/header';

export class MainPage {
  elem: HTMLElement;
  header: Header;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['main-page'] });
    this.header = new Header();
  }

  render() {
    this.elem.append(this.header.elem);
    const main = layoutService.createElement({ tag: 'main', classes: ['main'] });
    this.elem.append(main);
    document.body.append(this.elem);
  }
}
