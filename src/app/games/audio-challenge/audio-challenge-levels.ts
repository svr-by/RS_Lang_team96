import BaseComponent from '../utility/base_component';
import AudioChallange from '../audio-challenge/audio-challenge';
import IWord from '../../../interfaces/word';
import getWords from '../utility/get-words';
import IStorage from '../utility/storage';

export default class AudioChallangeLvl {
  readonly audioChallangeLvl: HTMLElement;

  readonly container: HTMLElement;

  public wordsInGroup: IWord[];

  public storage: IStorage;

  public currentCountWord: string;

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
    };
    this.currentCountWord = '1';
  }

  async addListenerToButtonLvl(target: HTMLElement | null): Promise<void> {
    if (target && target.tagName === 'DIV') {
      if (target.dataset.group) {
        const arrPromisesFromPages30: Promise<IWord[]>[] = [];
        for (let i = 0; i < 30; i += 1) {
          const promisFromPage = getWords(target.dataset.group, `${i}`);
          arrPromisesFromPages30.push(promisFromPage);
        }
        const arrOfArrsWords = await Promise.all(arrPromisesFromPages30);
        this.wordsInGroup = arrOfArrsWords.reduce((a, b) => a.concat(b));
        // ПЕРЕРИСОВКА
        this.audioChallangeLvl.remove();
        new AudioChallange(this.root, this.wordsInGroup, this.currentCountWord, this.storage).render();
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

    this.container.addEventListener('click', ({ target }) => this.addListenerToButtonLvl(target as HTMLElement));

    return this.audioChallangeLvl;
  }
}
