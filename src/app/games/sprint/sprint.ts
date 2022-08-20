import BaseComponent from 'src/app/games/utility/base_component';
import playSound from 'src/app/games/utility/play-sound';
import CardBox from 'src/app/games/sprint/components/sprint-cardBox';
import ResultSprint from 'src/app/games/sprint/components/sprint-result';
import IWord from 'src/interfaces/word';
import IStorage from 'src/app/games/utility/storage';
import './style.scss';

export default class Sprint {
  readonly sprint: HTMLElement;

  readonly container: HTMLElement;

  readonly buttonsBox: HTMLElement;

  public currentWord: IWord;

  public timer: NodeJS.Timer;

  constructor(
    private readonly root: HTMLElement,
    public wordsInGroup: IWord[],
    public storage: IStorage,
    public seconds: number
  ) {
    this.sprint = document.createElement('div');
    this.container = document.createElement('div');
    this.buttonsBox = document.createElement('div');
    this.currentWord = this.getRandomWordInGroup();
    this.timer = setInterval(() => {
      const timerShow: HTMLElement | null = document.querySelector('.sprint__timer');
      if (this.seconds <= 0) {
        clearInterval(this.timer);
        document.removeEventListener('keydown', this.findButton);
        this.sprint.remove();
        new ResultSprint(this.root, this.storage).render();
      } else {
        const strTimer = `${Math.trunc(this.seconds / 10)}`;
        if (timerShow) {
          timerShow.textContent = strTimer;
        }
      }
      this.seconds -= 1;
    }, 100);
  }

  getRandomWordInGroup(): IWord {
    const randomWord = Math.floor(Math.random() * 600);
    return this.wordsInGroup[randomWord];
  }

  pushBtnSound = () => {
    playSound(this.currentWord);
  };

  pushBtnFalse(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      const textTranslate = document.querySelector('.sprint__translate');
      if (textTranslate) {
        if (this.currentWord.wordTranslate !== textTranslate!.innerHTML) {
          const sound = new Audio();
          sound.src = 'src/app/games/assets/sounds/success.mp3';
          sound.autoplay = true;
          this.storage.inRow += 1;
          this.storage.setInRow.add(this.storage.inRow);
          if (this.storage.inRow <= 3) {
            this.storage.score += 10;
          }
          if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
            this.storage.score += 20;
          }
          if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
            this.storage.score += 40;
          }
          if (this.storage.inRow >= 10) {
            this.storage.score += 80;
          }
          this.storage.countAnswerCorrect += 1;
          this.storage.namesAnswerCorrect.push(this.currentWord.word);
          this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerCorrectSound.push(`http://localhost:8000/${this.currentWord.audio}`);
        } else {
          const sound = new Audio();
          sound.src = 'src/app/games/assets/sounds/fail.mp3';
          sound.autoplay = true;
          this.storage.inRow = 0;
          this.storage.countAnswerWrong += 1;
          this.storage.namesAnswerWrong.push(this.currentWord.word);
          this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerWrongSound.push(`http://localhost:8000/${this.currentWord.audio}`);
        }
        // ПЕРЕРИСОВКА
        const counterScore = document.querySelector('.sprint__score');
        if (counterScore) {
          counterScore.innerHTML = `${this.storage.score}`;
        }
        clearInterval(this.timer);
        document.removeEventListener('keydown', this.findButton);
        this.sprint.remove();
        new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
      }
    }
  }

  pushBtnTrue(target: HTMLElement | null): void {
    if (target && target.tagName === 'BUTTON') {
      const textTranslate = document.querySelector('.sprint__translate');
      if (textTranslate) {
        if (this.currentWord.wordTranslate === textTranslate.innerHTML) {
          const sound = new Audio();
          sound.src = 'src/app/games/assets/sounds/success.mp3';
          sound.autoplay = true;
          this.storage.inRow += 1;
          this.storage.setInRow.add(this.storage.inRow);
          if (this.storage.inRow <= 3) {
            this.storage.score += 10;
          }
          if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
            this.storage.score += 20;
          }
          if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
            this.storage.score += 40;
          }
          if (this.storage.inRow >= 10) {
            this.storage.score += 80;
          }
          this.storage.countAnswerCorrect += 1;
          this.storage.namesAnswerCorrect.push(this.currentWord.word);
          this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerCorrectSound.push(`http://localhost:8000/${this.currentWord.audio}`);
        } else {
          const sound = new Audio();
          sound.src = 'src/app/games/assets/sounds/fail.mp3';
          sound.autoplay = true;
          this.storage.inRow = 0;
          this.storage.countAnswerWrong += 1;
          this.storage.namesAnswerWrong.push(this.currentWord.word);
          this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerWrongSound.push(`http://localhost:8000/${this.currentWord.audio}`);
        }
        // ПЕРЕРИСОВКА
        const counterScore = document.querySelector('.sprint__score');
        if (counterScore) {
          counterScore.innerHTML = `${this.storage.score}`;
        }
        clearInterval(this.timer);
        document.removeEventListener('keydown', this.findButton);
        this.sprint.remove();
        new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
      }
    }
  }

  pressLeft = () => {
    const textTranslate = document.querySelector('.sprint__translate');
    if (textTranslate) {
      if (this.currentWord.wordTranslate !== textTranslate!.innerHTML) {
        const sound = new Audio();
        sound.src = 'src/app/games/assets/sounds/success.mp3';
        sound.autoplay = true;
        this.storage.inRow += 1;
        this.storage.setInRow.add(this.storage.inRow);
        if (this.storage.inRow <= 3) {
          this.storage.score += 10;
        }
        if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
          this.storage.score += 20;
        }
        if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
          this.storage.score += 40;
        }
        if (this.storage.inRow >= 10) {
          this.storage.score += 80;
        }
        this.storage.countAnswerCorrect += 1;
        this.storage.namesAnswerCorrect.push(this.currentWord.word);
        this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerCorrectSound.push(`http://localhost:8000/${this.currentWord.audio}`);
      } else {
        const sound = new Audio();
        sound.src = 'src/app/games/assets/sounds/fail.mp3';
        sound.autoplay = true;
        this.storage.inRow = 0;
        this.storage.countAnswerWrong += 1;
        this.storage.namesAnswerWrong.push(this.currentWord.word);
        this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerWrongSound.push(`http://localhost:8000/${this.currentWord.audio}`);
      }
      // ПЕРЕРИСОВКА
      const counterScore = document.querySelector('.sprint__score');
      if (counterScore) {
        counterScore.innerHTML = `${this.storage.score}`;
      }
      clearInterval(this.timer);
      document.removeEventListener('keydown', this.findButton);
      this.sprint.remove();
      new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
    }
  };

  pressRight = () => {
    const textTranslate = document.querySelector('.sprint__translate');
    if (textTranslate) {
      if (this.currentWord.wordTranslate === textTranslate.innerHTML) {
        const sound = new Audio();
        sound.src = 'src/app/games/assets/sounds/success.mp3';
        sound.autoplay = true;
        this.storage.inRow += 1;
        this.storage.setInRow.add(this.storage.inRow);
        if (this.storage.inRow <= 3) {
          this.storage.score += 10;
        }
        if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
          this.storage.score += 20;
        }
        if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
          this.storage.score += 40;
        }
        if (this.storage.inRow >= 10) {
          this.storage.score += 80;
        }
        this.storage.countAnswerCorrect += 1;
        this.storage.namesAnswerCorrect.push(this.currentWord.word);
        this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerCorrectSound.push(`http://localhost:8000/${this.currentWord.audio}`);
      } else {
        const sound = new Audio();
        sound.src = 'src/app/games/assets/sounds/fail.mp3';
        sound.autoplay = true;
        this.storage.inRow = 0;
        this.storage.countAnswerWrong += 1;
        this.storage.namesAnswerWrong.push(this.currentWord.word);
        this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerWrongSound.push(`http://localhost:8000/${this.currentWord.audio}`);
      }
      // ПЕРЕРИСОВКА
      const counterScore = document.querySelector('.sprint__score');
      if (counterScore) {
        counterScore.innerHTML = `${this.storage.score}`;
      }
      clearInterval(this.timer);
      document.removeEventListener('keydown', this.findButton);
      this.sprint.remove();
      new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
    }
  };

  findButton = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      this.pressRight();
    }
    if (event.key === 'ArrowLeft') {
      this.pressLeft();
    }
  };

  render(): HTMLElement {
    this.root.appendChild(this.sprint);
    this.sprint.classList.add('sprint');
    new BaseComponent(this.sprint, 'h2', ['sprint__timer'], `${Math.trunc(this.seconds / 10)}`).render();

    this.sprint.appendChild(this.container);
    this.container.classList.add('sprint__container');

    new BaseComponent(this.container, 'h2', ['sprint__score'], `${this.storage.score}`).render();
    new CardBox(this.container, this.wordsInGroup, this.currentWord).render();

    this.sprint.appendChild(this.buttonsBox);
    this.buttonsBox.classList.add('sprint__buttons-box');

    new BaseComponent(this.buttonsBox, 'button', ['sprint__button-false'], 'false').render();
    new BaseComponent(this.buttonsBox, 'button', ['sprint__button-true'], 'true').render();

    playSound(this.currentWord);

    const imgBox = document.querySelector('.sprint__img-box');
    imgBox!.innerHTML = '+10';
    if (this.storage.inRow > 2 && this.storage.inRow <= 5) {
      imgBox!.innerHTML = '+20';
    }
    if (this.storage.inRow > 5 && this.storage.inRow <= 8) {
      imgBox!.innerHTML = '+40';
    }
    if (this.storage.inRow >= 9) {
      imgBox!.innerHTML = '+80';
    }

    const marks = document.querySelectorAll('.mark');
    if (this.storage.inRow > 0 && this.storage.inRow <= 3) {
      marks[this.storage.inRow - 1].setAttribute('style', 'background-color: #FFE500');
    }
    if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
      marks[this.storage.inRow % 4].setAttribute('style', 'background-color: #34D800');
    }
    if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
      marks[this.storage.inRow % 7].setAttribute('style', 'background-color: #AC3BD4');
    }

    const btnSound = document.querySelector('.sprint__button-sound');
    if (btnSound) {
      btnSound.addEventListener('click', this.pushBtnSound);
    }

    const btnFalse = document.querySelector('.sprint__button-false');
    if (btnFalse) {
      btnFalse.addEventListener('click', ({ target }) => this.pushBtnFalse(target as HTMLElement));
    }

    const btnTrue = document.querySelector('.sprint__button-true');
    if (btnTrue) {
      btnTrue.addEventListener('click', ({ target }) => this.pushBtnTrue(target as HTMLElement));
    }

    document.addEventListener('keydown', this.findButton);

    return this.sprint;
  }
}
