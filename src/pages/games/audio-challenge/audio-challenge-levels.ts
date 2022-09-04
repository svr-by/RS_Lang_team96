import BaseComponent from '../../../shared/components/base_component';
import AudioChallange from '../audio-challenge/audio-challenge';
import { IWord, IStorage } from '../../../shared/interfaces';
import { wordsApiService } from '../../../api/wordsApiService';

export default class AudioChallangeLvl {
  audioChallangeLvl: HTMLElement;
  container: HTMLElement;
  wordsInGroup: IWord[];
  storage: IStorage;
  currentCountWord: string;
  isPush: boolean;

  constructor(private readonly root: HTMLElement) {
    this.audioChallangeLvl = document.createElement('div');
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
    this.currentCountWord = '1';
    this.isPush = false;
  }

  async addListenerToButtonLvl(target: HTMLElement): Promise<void> {
    if (!this.isPush) {
      this.isPush = true;
      if (target && target.tagName === 'DIV') {
        if (target.dataset.group) {
          const arrPromisesFromPages30: Promise<IWord[]>[] = [];
          for (let i = 0; i < 30; i += 1) {
            const promiseFromPage = wordsApiService.getWords(+target.dataset.group, i) as Promise<IWord[]>;
            arrPromisesFromPages30.push(promiseFromPage);
          }
          const arrOfArrsWords = await Promise.all(arrPromisesFromPages30);
          this.wordsInGroup = arrOfArrsWords.reduce((a, b) => a.concat(b));
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
      'Audio challenge'
    ).render();
    new BaseComponent(
      this.audioChallangeLvl,
      'h3',
      ['main__games__audio-challange-levels__title'],
      'Select the Level'
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
