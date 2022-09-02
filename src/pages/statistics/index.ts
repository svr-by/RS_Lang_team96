import { layoutService } from '../../shared/services/layoutService';

class StatsPage {
  elem: HTMLElement;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'section', classes: ['stats__wrapper'] });
  }

  render() {
    this.elem.innerHTML = `
      <div class="wrapper">
        <h2 class="page-title">Статистика за день</h2>
        <div class="stats">
          <div class="stats__numbers">
            <div class="stats__index">
              <h3 class="stats__digit">0</h3>
              <h4 class="stats__name">слов изучено</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">0</h3>
              <h4 class="stats__name">серия правильных ответов</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">0%</h3>
              <h4 class="stats__name">правильных ответов</h4>
            </div>
          </div>
          <div class="stats__games">
            ${this.renderGameStats('Спринт')}
            ${this.renderGameStats('Аудиовызов')}
          </div>
        </div>
      </div>
    `;
    return this.elem;
  }

  private renderGameStats(name: string, words = '0', right = '0', series = '0') {
    return `
    <div class="game-stat">
      <h4 class="game-stat__name">${name}</h4>
      <p class="game-stat__words">Новые слова: ${words}</p>
      <p class="game-stat__right">Верные ответы: ${right}</p>
      <p class="game-stat__series">Серия слов: ${series}</p>
    </div>
    `;
  }
}

export default StatsPage;
