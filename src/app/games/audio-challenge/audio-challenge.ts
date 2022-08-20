import BaseComponent from 'src/app/games/utility/base_component';
import AnswerBox from 'src/app/games/audio-challenge/components/answer-box';
import playSound from 'src/app/games/utility/play-sound';
import IWord from 'src/interfaces/word';
import IStorage from 'src/app/games/utility/storage';
import Result from 'src/app/games/audio-challenge/components/result';
import './style.scss';

export default class AudioChallange {
  readonly audioChallange: HTMLElement;

  readonly containerPanel: HTMLElement;

  readonly currentWord: IWord;

  public isPush: boolean;

  constructor(
    private readonly root: HTMLElement,
    public wordsInGroup: IWord[],
    public currentCountWord: string,
    public storage: IStorage
  ) {
    this.audioChallange = document.createElement('div');
    this.containerPanel = document.createElement('div');
    this.wordsInGroup = wordsInGroup;
    this.currentWord = this.getRandomWordInGroup();
    this.isPush = false;
  }

  getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * 600);
    return this.wordsInGroup[randomIndex].wordTranslate;
  }

  getRandomWordInGroup(): IWord {
    const randomWord = Math.floor(Math.random() * 600);
    return this.wordsInGroup[randomWord];
  }

  pushBtnSound = (): void => {
    playSound(this.currentWord);
  };

  pushBtnSkipNext(target: HTMLElement | null): void {
    if (target && target.tagName === 'DIV') {
      // ПЕРЕРИСОВКА
      const audioChallange: HTMLElement | null = document.querySelector('.main__games__audio-challange');
      const main: HTMLElement | null = document.querySelector('.main');
      if (audioChallange && main) {
        this.currentCountWord = (+this.currentCountWord + 1).toString();
        audioChallange.remove();
        if (+this.currentCountWord > 20) {
          new Result(main, this.storage).render();
        } else {
          new AudioChallange(main, this.wordsInGroup, this.currentCountWord, this.storage).render();
        }
      }
    }
  }

  pushBtnAnswer(target: HTMLElement | null): void {
    if (target && target.tagName === 'DIV') {
      if (!this.isPush) {
        this.isPush = true;
        target.classList.add('answer');
        target.setAttribute('data-answer', 'yes');
        const img = document.querySelector('.main__games__audio-challange-img');
        img!.setAttribute('src', `http://localhost:8000/${this.currentWord.image}`);
        const sound = new Audio();
        sound.src = '../../../../assets/sounds/success.mp3';
        sound.autoplay = true;
        this.storage.inRow += 1;
        this.storage.setInRow.add(this.storage.inRow);
        this.storage.countAnswerСorrect += 1;
        this.storage.namesAnswerСorrect.push(this.currentWord.word);
        this.storage.namesAnswerСorrectTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerСorrectSound.push(`http://localhost:8000/${this.currentWord.audio}`);

        // ПЕРЕРИСОВКА
        const btnSkip: HTMLElement | null = document.querySelector('.main__games__audio-challange-buttonSkip');
        if (btnSkip) {
          btnSkip.classList.add('main__games__audio-challange-buttonNext');
          btnSkip.innerHTML = 'NEXT';
          const btnAnswer: HTMLElement = target;
          btnAnswer.innerHTML = `
            <p>${this.currentWord.word}</p>
            <p>${this.currentWord.transcription}</p>
            <p>${this.currentWord.wordTranslate}</p>
          `;
        }
      }
    }
  }

  pushBtnWrong(target: HTMLElement | null): void {
    if (target && target.tagName === 'DIV') {
      if (!this.isPush) {
        this.isPush = true;
        target.setAttribute('data-answer', 'no');
        const img = document.querySelector('.main__games__audio-challange-img');
        img!.setAttribute('src', `http://localhost:8000/${this.currentWord.image}`);
        const sound = new Audio();
        sound.src = '../../../../assets/sounds/fail.mp3';
        sound.autoplay = true;
        this.storage.inRow = 0;
        this.storage.countAnswerWrong += 1;
        this.storage.namesAnswerWrong.push(this.currentWord.word);
        this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerWrongSound.push(`http://localhost:8000/${this.currentWord.audio}`);
      }
    }
  }

  render(): HTMLElement {
    this.root.appendChild(this.audioChallange);
    this.audioChallange.classList.add('main__games__audio-challange');

    new BaseComponent(this.audioChallange, 'img', ['main__games__audio-challange-img'])
      .render()
      .setAttribute('src', '../../../../../assets/svg/question.svg');
    new BaseComponent(this.audioChallange, 'div', ['main__games__audio-challange-buttonSound']).render();
    new BaseComponent(this.audioChallange, 'div', ['main__games__audio-challange-buttonSkip'], 'SKIP &#10162').render();
    new AnswerBox(this.audioChallange).render();

    this.audioChallange.appendChild(this.containerPanel);
    this.containerPanel.classList.add('main__games__audio-challange__containerPanel');
    new BaseComponent(
      this.containerPanel,
      'div',
      ['main__games__audio-challange__containerPanel-counter'],
      `<span class="audio-challange__words-count">${this.currentCountWord}</span>/<span class="audio-challange__words-all">20</span>`
    ).render();

    playSound(this.currentWord);

    const randomNum = Math.floor(Math.random() * 4);
    const buttonsArray = document.querySelectorAll('.main__games__audio-challange__buttonAnswer');

    buttonsArray[0].innerHTML = this.getRandomWord();
    buttonsArray[1].innerHTML = this.getRandomWord();
    buttonsArray[2].innerHTML = this.getRandomWord();
    buttonsArray[3].innerHTML = this.getRandomWord();

    const btnAnswerRight: HTMLElement | null = document.querySelector(`.answer-${randomNum}`);
    if (btnAnswerRight) {
      btnAnswerRight.dataset.answer = '0';
      btnAnswerRight.innerHTML = this.currentWord.wordTranslate;
      btnAnswerRight.addEventListener('click', ({ target }) => this.pushBtnAnswer(target as HTMLElement));
    }

    buttonsArray.forEach((item) => {
      item.addEventListener('click', ({ target }) => this.pushBtnWrong(target as HTMLElement));
    });

    const btnSound: HTMLElement | null = document.querySelector('.main__games__audio-challange-buttonSound');
    if (btnSound) {
      btnSound.addEventListener('click', this.pushBtnSound);
    }

    const btnSkip: HTMLElement | null = document.querySelector('.main__games__audio-challange-buttonSkip');
    if (btnSkip) {
      btnSkip.addEventListener('click', ({ target }) => this.pushBtnSkipNext(target as HTMLElement));
    }

    return this.audioChallange;
  }
}
