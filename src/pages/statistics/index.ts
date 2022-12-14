import { IStatByGames } from '../../shared/interfaces';
import { GameStats } from '../../shared/types';
import { SignInResponse } from '../../shared/types';
import { layoutService } from '../../shared/services/layoutService';
import { storageService } from '../../shared/services/storageService';
import { dateToday } from '../../shared/services/dateService';
import { statisticApiService } from '../../api/statisticApiService';
import { Modal } from '../../shared/components/modal';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { userService } from '../../shared/services/userService';
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
      type: 'line',
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
    const user = this.isUserAuthorized();
    const stats = storageService.getSession<IStatByGames>('StatByGames');

    if (user && stats) {
      if (dateToday === stats.date) {
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
    } else if (!user) {
      this.showAuthorizationMess();
    }

    this.elem.innerHTML = `
      <section class="day-stats"> 
        <h2 class="page-title">???????????????????? ???? ????????</h2>
        <div class="stats">
          <div class="stats__numbers">
            <div class="stats__index">
              <h3 class="stats__digit">${allNewWords}</h3>
              <h4 class="stats__name">?????????? ????????</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">${bestSeries}</h3>
              <h4 class="stats__name">?????????? ???????????????????? ??????????????</h4>
            </div>
            <div class="stats__index">
              <h3 class="stats__digit">${allGamesRightPercent}%</h3>
              <h4 class="stats__name">???????????????????? ??????????????</h4>
            </div>
          </div>
          <div class="stats__games">
            ${this.renderGameStats('????????????', user, sprintStats)}
            ${this.renderGameStats('????????????????????', user, audiocallStats)}
          </div>
        </div>
      </section>
    `;
    if (user) this.renderChart();
    return this.elem;
  }

  private renderGameStats(name: string, user: boolean, stats: GameStats) {
    const titleClass = user ? 'game-stat__name active' : 'game-stat__name';
    return `
    <div class="game-stat">
      <h4 class="${titleClass}">${name}</h4>
      <p class="game-stat__words">?????????? ??????????: ${stats.words}</p>
      <p class="game-stat__right">???????????? ????????????: ${stats.right}</p>
      <p class="game-stat__series">?????????? ??????????????: ${stats.series}</p>
    </div>
    `;
  }

  private showAuthorizationMess() {
    const mess = layoutService.createElement({
      tag: 'h3',
      text: '???????????????????? ???????????????? ???????????? ?????? ???????????????????????????? ??????????????????????????',
    });
    new Modal().showModal(mess);
  }

  async renderChart() {
    const longStats = layoutService.createElement({ tag: 'section', classes: ['long-stats'] });

    const title = layoutService.createElement({
      tag: 'h2',
      text: '???????????????????????????? ????????????????????',
      classes: ['page-title'],
    });
    longStats.append(title);

    const chartWrap = layoutService.createElement({ tag: 'div', classes: ['chart-wrap'] });
    chartWrap.append(this.canvas);
    longStats.append(chartWrap);

    const userId = userService.getStoredUserId();
    const userStats = await statisticApiService.getUserStatistics(userId);
    const dates = userStats?.optional ? Object.keys(userStats.optional) : [];
    const words = userStats?.optional ? Object.values(userStats.optional) : [];
    const agrLearnWords = words.reduce(
      (acc: number[], el: number, ind: number) => (ind === 0 ? acc.concat([el]) : acc.concat([el + acc[ind - 1]])),
      []
    );

    this.chartConfig.data.labels = dates;
    this.chartConfig.data.datasets = [
      {
        label: '?????????? ??????????',
        barPercentage: 0.8,
        categoryPercentage: 1,
        backgroundColor: `#16b0e8`,
        fill: true,
        data: words,
      },
      {
        label: '?????????? ?????????? ????????',
        barPercentage: 1,
        categoryPercentage: 1,
        backgroundColor: `#74fea4`,
        pointRadius: 10,
        data: agrLearnWords,
      },
    ];

    if (this.isUserAuthorized()) this.elem.append(longStats);
  }

  private isUserAuthorized() {
    return storageService.getLocal<SignInResponse>('user') ? true : false;
  }
}

export default StatsPage;
