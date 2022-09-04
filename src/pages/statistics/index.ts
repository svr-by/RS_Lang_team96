import { IStatByGames } from '../../shared/interfaces';
import { GameStats } from '../../shared/types';
import { SignInResponse } from '../../shared/types';
import { layoutService } from '../../shared/services/layoutService';
import { storageService } from '../../shared/services/storageService';
import { Modal } from '../../shared/components/modal';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

class StatsPage {
  elem: HTMLElement;
  canvas: HTMLCanvasElement;
  chart: Chart;
  chartConfig: ChartConfiguration;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['wrapper'] });
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'myChart';
    this.chartConfig = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
    };
    this.chart = new Chart(this.canvas.getContext('2d') as CanvasRenderingContext2D, this.chartConfig);
  }

  render() {
    let allNewWords = 0;
    let bestSeries = 0;
    let allGamesRightPercent = 0;
    const sprintStats: GameStats = { words: 0, right: 0, series: 0 };
    const audiocallStats: GameStats = { words: 0, right: 0, series: 0 };
    const isUserSigin = storageService.getLocal<SignInResponse>('user') ? true : false;
    const stats = storageService.getLocal<IStatByGames>('stats');

    if (isUserSigin && stats) {
      const isSameDay = this.checkDate(stats.date);
      if (isSameDay) {
        allNewWords = stats.allNewWords;
        const audioCallBest = stats.games.audioCall.bestSeries;
        const sprintBest = stats.games.sprint.bestSeries;
        bestSeries = audioCallBest > sprintBest ? audioCallBest : sprintBest;
        allGamesRightPercent = Math.trunc(stats.allGamesRightPercent);
        sprintStats.words = stats.games.sprint.newWords;
        sprintStats.right = stats.games.sprint.right;
        sprintStats.series = stats.games.sprint.bestSeries;
        audiocallStats.words = stats.games.audioCall.newWords;
        audiocallStats.right = stats.games.audioCall.right;
        audiocallStats.series = stats.games.audioCall.bestSeries;
      }
    } else if (!isUserSigin) {
      this.showAuthorizationMess();
    }

    this.elem.innerHTML = `
      <section class="day-stats"> 
        <h2 class="page-title">Статистика за день</h2>
        <div class="stats">
          <div class="stats__numbers">
            <div class="stats__index">
              <h3 class="stats__digit">${allNewWords}</h3>
              <h4 class="stats__name">слов изучено</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">${bestSeries}</h3>
              <h4 class="stats__name">серия правильных ответов</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">${allGamesRightPercent}%</h3>
              <h4 class="stats__name">правильных ответов</h4>
            </div>
          </div>
          <div class="stats__games">
            ${this.renderGameStats('Спринт', isUserSigin, sprintStats)}
            ${this.renderGameStats('Аудиовызов', isUserSigin, audiocallStats)}
          </div>
        </div>
      </section>
    `;
    if (isUserSigin) this.renderChart();
    return this.elem;
  }

  private renderGameStats(name: string, isUserSigin: boolean, stats: GameStats) {
    const titleClass = isUserSigin ? 'game-stat__name active' : 'game-stat__name';
    return `
    <div class="game-stat">
      <h4 class="${titleClass}">${name}</h4>
      <p class="game-stat__words">Новые слова: ${stats.words}</p>
      <p class="game-stat__right">Верные ответы: ${stats.right}</p>
      <p class="game-stat__series">Серия ответов: ${stats.series}</p>
    </div>
    `;
  }

  private showAuthorizationMess() {
    const mess = layoutService.createElement({
      tag: 'h3',
      text: 'Статистика доступна только для авторизованных пользователей',
    });
    new Modal().showModal(mess);
  }

  private checkDate(date: string) {
    const statsDate = new Date(date);
    const today = new Date();
    return today.getDate() === statsDate.getDate() && today.getMonth() === statsDate.getMonth();
  }

  renderChart() {
    const longStats = layoutService.createElement({ tag: 'section', classes: ['long-stats'] });

    const title = layoutService.createElement({
      tag: 'h2',
      text: 'Долговременная статистика',
      classes: ['page-title'],
    });
    longStats.append(title);

    const chartWrap = layoutService.createElement({ tag: 'div', classes: ['chart-wrap'] });
    chartWrap.append(this.canvas);
    longStats.append(chartWrap);

    this.chartConfig.data.labels = ['30-08-2022', '31-08-2022', '01-09-2022', '02-09-2022', '03-09-2022', '04-09-2022'];
    this.chartConfig.data.datasets = [
      {
        label: 'Количество новых слов',
        backgroundColor: `#16b0e8`,
        data: [12, 19, 21, 21, 25, 30],
      },
    ];

    this.elem.append(longStats);
  }
}

export default StatsPage;
