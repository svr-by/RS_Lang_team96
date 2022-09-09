import BaseComponent from '../../../shared/components/base_component';
import Sprint from './sprint';
import { IWord, IStorage } from '../../../shared/interfaces';
import { wordsApiService } from '../../../api/wordsApiService';
import { Preloader } from '../../../shared/components/preloader';

export default class SprintLvl {
  readonly sprintLvl: HTMLElement;
  readonly container: HTMLElement;
  public wordsInGroup: IWord[];
  public storage: IStorage;
  public seconds: number;
  isPush: boolean;

  constructor(private readonly root: HTMLElement) {
    this.sprintLvl = document.createElement('div');
    this.container = document.createElement('section');
    this.wordsInGroup = [] as IWord[];
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
    this.seconds = 600;
    this.isPush = false;
  }

  async addListenerToButtonLvl(target: HTMLElement | null) {
    if (!this.isPush) {
      this.isPush = true;
      if (target && target.tagName === 'DIV') {
        if (target.dataset.group) {
          const preloader = new Preloader().render();
          this.sprintLvl.append(preloader);
          const arrPromisesFromPages30: Promise<IWord[]>[] = [];
          for (let i = 0; i < 30; i += 1) {
            const promiseFromPage = wordsApiService.getWords(+target.dataset.group, i) as Promise<IWord[]>;
            arrPromisesFromPages30.push(promiseFromPage);
          }
          const arrOfArrsWords = await Promise.all(arrPromisesFromPages30);
          preloader.remove();
          this.wordsInGroup = arrOfArrsWords.reduce((a, b) => a.concat(b));
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
