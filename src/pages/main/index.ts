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
    main.innerHTML = `
    <div class="wrapper main__wrapper">
      <div class="text-block">
        <h2 class="text-block__title">Учите английский бесплатно, легко и эффективно!</h2>
        <p class="text-block__text">Приложение для изучения иностранных слов в игровой форме. Всегда под рукой. На любом устройстве.</p>
        <button class="button text-block__btn">Видеообзор</button>
      </div>
      <div class="cards-block">
        <div class="card">
          <div class="card__img-wrap">
            <img src="assets/img/free.png" alt="Free access" class="card__img">
          </div>  
          <h4 class="card__title">Бесплатный доступ</h4>
          <p class="card__text">Наше приложение доступно для каждого</p>
        </div>
        <div class="card">
          <div class="card__img-wrap">
            <img src="assets/img/game.png" alt="Learning by playing" class="card__img">
          </div>  
          <h4 class="card__title">Обучение в игре</h4>
          <p class="card__text">Обучение в игровой форме, скучно не будет!</p>
        </div>
        <div class="card">
          <div class="card__img-wrap">
            <img src="assets/img/book.png" alt="Huge dictionary" class="card__img">
          </div>  
          <h4 class="card__title">Огромный словарь</h4>
          <p class="card__text">В нашем словаре 3600 часто употребляемых английских слов</p>
        </div>
        <div class="card">
          <div class="card__img-wrap">
            <img src="assets/img/stats.png" alt="Personal statistics" class="card__img">
          </div>  
          <h4 class="card__title">Персональная статистика</h4>
          <p class="card__text">Отслеживайте свои результаты, потдерживайте мотивацию</p>
        </div>
      </div>  
    </div>
    <div class="animation">
      <div id="starsS"></div>
      <div id="starsM"></div>
      <div id="starsL"></div>
    </div>
    `;
    this.elem.append(main);
    this.elem.append(this.footer.elem);
    document.body.append(this.elem);
  }
}
