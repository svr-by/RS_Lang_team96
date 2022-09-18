import BaseComponent from '../../../shared/components/base_component';
import AudioChallange from '../audio-challenge/audio-challenge';
import { IWord, IAggregatedWord, IStorage } from '../../../shared/interfaces';
import { AggregatedWordsResponse } from '../../../shared/types';
import { wordsApiService } from '../../../api/wordsApiService';
import { Preloader } from '../../../shared/components/preloader';
import { userService } from '../../../shared/services/userService';

export default class AudioChallangeLvl {
  audioChallangeLvl: HTMLElement;
  container: HTMLElement;
  wordsInGroup: IWord[] | IAggregatedWord[];
  storage: IStorage;
  currentCountWord: string;
  isPush: boolean;

  constructor(private readonly root: HTMLElement) {
    this.audioChallangeLvl = document.createElement('div');
    this.container = document.createElement('section');
    this.wordsInGroup = [];
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
    this.currentCountWord = '1';
    this.isPush = false;
  }

  async addListenerToButtonLvl(target: HTMLElement): Promise<void> {
    if (!this.isPush) {
      this.isPush = true;
      if (target && target.tagName === 'DIV') {
        if (target.dataset.group) {
          const preloader = new Preloader().render();
          this.audioChallangeLvl.append(preloader);

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
          this.audioChallangeLvl.remove();
          new AudioChallange(this.root, this.wordsInGroup, this.currentCountWord, this.storage).render();
        }
      }
    }
  }

  render(): HTMLElement {
    this.root.appendChild(this.audioChallangeLvl);
    this.audioChallangeLvl.classList.add('main__games__audio-challange-levels');

    new BaseComponent(
      this.audioChallangeLvl,
      'h2',
      ['main__games__audio-challange-levels__head'],
      '"Аудиовызов"'
    ).render();
    new BaseComponent(
      this.audioChallangeLvl,
      'h3',
      ['main__games__audio-challange-levels__title'],
      'Выберите уровень:'
    ).render();

    this.audioChallangeLvl.appendChild(this.container);
    this.container.classList.add('main__games__audio-challange-levels__container');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-1'], '1')
      .render()
      .setAttribute('data-group', '0');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-2'], '2')
      .render()
      .setAttribute('data-group', '1');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-3'], '3')
      .render()
      .setAttribute('data-group', '2');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-4'], '4')
      .render()
      .setAttribute('data-group', '3');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-5'], '5')
      .render()
      .setAttribute('data-group', '4');
    new BaseComponent(this.container, 'div', ['main__games__audio-challange-levels-group', 'lvl-6'], '6')
      .render()
      .setAttribute('data-group', '5');

    this.container.addEventListener('click', ({ target }) => this.addListenerToButtonLvl(target as HTMLElement), {
      once: true,
    });

    return this.audioChallangeLvl;
  }
}
