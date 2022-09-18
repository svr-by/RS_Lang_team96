import BaseComponent from '../../../shared/components/base_component';
import Sprint from './sprint';
import { IWord, IAggregatedWord, IStorage } from '../../../shared/interfaces';
import { AggregatedWordsResponse } from '../../../shared/types';
import { wordsApiService } from '../../../api/wordsApiService';
import { Preloader } from '../../../shared/components/preloader';
import { userService } from '../../../shared/services/userService';

export default class SprintLvl {
  readonly sprintLvl: HTMLElement;
  readonly container: HTMLElement;
  public wordsInGroup: IWord[] | IAggregatedWord[];
  public storage: IStorage;
  public seconds: number;
  isPush: boolean;

  constructor(private readonly root: HTMLElement) {
    this.sprintLvl = document.createElement('div');
    this.container = document.createElement('section');
    this.wordsInGroup = [] as IWord[] | IAggregatedWord[];
    this.storage = {
      countAnswerCorrect: 0,
      namesAnswerCorrect: [],
      namesAnswerCorrectTranslate: [],
      namesAnswerCorrectSound: [],
      inRow: 0,
      setInRow: new Set(),
      countAnswerWrong: 0,
      namesAnswerWrong: [],
      namesAnswerWrongTranslate: [],
      namesAnswerWrongSound: [],
      score: 0,
      newWords: 0,
    };
    this.seconds = 300;
    this.isPush = false;
  }

  async addListenerToButtonLvl(target: HTMLElement | null) {
    if (!this.isPush) {
      this.isPush = true;
      if (target && target.tagName === 'DIV') {
        if (target.dataset.group) {
          const preloader = new Preloader().render();
          this.sprintLvl.append(preloader);
          const arrPromisesFromPages3: Promise<IWord[] | AggregatedWordsResponse[]>[] = [];
          const userId = userService.getStoredUserId();
          let arrOfArrsWords: IWord[][] | IAggregatedWord[][];

          if (!userId) {
            for (let i = 0; i < 3; i += 1) {
              const randomPage = Math.floor(Math.random() * 30);
              const promiseFromPage = wordsApiService.getWords(+target.dataset.group, randomPage) as Promise<IWord[]>;
              arrPromisesFromPages3.push(promiseFromPage);
            }
            arrOfArrsWords = (await Promise.all(arrPromisesFromPages3)) as IWord[][];
          } else {
            for (let i = 0; i < 3; i += 1) {
              const randomPage = Math.floor(Math.random() * 30);
              const promiseFromPage = wordsApiService.getAggregatedUserWords(
                userId,
                randomPage,
                +target.dataset.group,
                20
              ) as Promise<AggregatedWordsResponse[]>;
              arrPromisesFromPages3.push(promiseFromPage);
            }
            const arrOfAgrResp = (await Promise.all(arrPromisesFromPages3)) as AggregatedWordsResponse[][];
            arrOfArrsWords = arrOfAgrResp.map((resp) => resp[0].paginatedResults);
          }

          preloader.remove();
          this.wordsInGroup = arrOfArrsWords.flat();
          this.sprintLvl.remove();
          new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
        }
      }
    }
  }

  render(): HTMLElement {
    this.root.innerHTML = '';
    this.root.appendChild(this.sprintLvl);
    this.sprintLvl.classList.add('main__games__sprint-levels');

    new BaseComponent(this.sprintLvl, 'h2', ['main__games__sprint-levels__head'], '"Спринт"').render();
    new BaseComponent(this.sprintLvl, 'h3', ['main__games__sprint-levels__title'], 'Выберите уровень:').render();

    this.sprintLvl.appendChild(this.container);
    this.container.classList.add('main__games__sprint-levels__container');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-1'], '1')
      .render()
      .setAttribute('data-group', '0');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-2'], '2')
      .render()
      .setAttribute('data-group', '1');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-3'], '3')
      .render()
      .setAttribute('data-group', '2');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-4'], '4')
      .render()
      .setAttribute('data-group', '3');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-5'], '5')
      .render()
      .setAttribute('data-group', '4');
    new BaseComponent(this.container, 'div', ['main__games__sprint-levels-group', 'lvl-6'], '6')
      .render()
      .setAttribute('data-group', '5');

    this.container.addEventListener('click', ({ target }) => this.addListenerToButtonLvl(target as HTMLElement), {
      once: true,
    });

    return this.sprintLvl;
  }
}
