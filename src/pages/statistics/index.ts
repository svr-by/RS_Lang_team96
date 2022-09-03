import { IStatByGames } from '../../shared/interfaces';
import { SignInResponse } from '../../shared/types';
import { layoutService } from '../../shared/services/layoutService';
import { storageService } from '../../shared/services/storageService';
import { Modal } from '../../shared/components/modal';
import { Chart } from 'chart.js';

type GameStats = {
  words: number;
  right: number;
  series: number;
};

class StatsPage {
  elem: HTMLElement;
  chart: HTMLCanvasElement;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['wrapper'] });
    this.chart = document.createElement('canvas');
    this.chart.id = 'myChart';
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
    // if (isUserSigin) this.renderChart();
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

    const ctx = this.chart.getContext('2d');
    if (ctx) {
      console.log(ctx);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
    longStats.append(this.chart);
    this.elem.append(longStats);
  }
}

export default StatsPage;
