import { layoutService } from '../../shared/services/layoutService';
import { navigationService } from '../../shared/services/navigationService';
import { NavLinks } from '../../shared/enums';

export class StartPage {
  elem: HTMLElement;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['start__wrapper'] });
    this.addListeners();
  }

  render() {
    this.elem.innerHTML = `
    <div class="wrapper">
      <div class="start-content">
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
    </div>
    <div>
      <div id="starsS"></div>
      <div id="starsM"></div>
      <div id="starsL"></div>
    </div>
    `;
    return this.elem;
  }

  private addListeners() {
    this.elem.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('text-block__btn')) {
        event.preventDefault();
        navigationService.followLink(NavLinks.video);
      }
    });
  }
}
