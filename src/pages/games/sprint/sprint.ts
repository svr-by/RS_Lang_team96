import BaseComponent from '../../../shared/components/base_component';
import playSound from '../../games/utility/play-sound';
import CardBox from '../../games/sprint/components/sprint-cardBox';
import ResultSprint from '../../games/sprint/components/sprint-result';
import { api } from '../../../api/api';
import { UserStatistics } from '../../../shared/types';
import { IWord, IStorage } from '../../../shared/interfaces';
import { userService } from '../../../shared/services/userService';
import { wordsApiService } from '../../../api/wordsApiService';
import { statisticApiService } from '../../../api/statisticApiService';
import { dateToday } from '../../../shared/services/dateService';

export default class Sprint {
  sprint: HTMLElement;

  container: HTMLElement;

  buttonsBox: HTMLElement;

  currentWord: IWord;

  isPush: boolean;

  timer: NodeJS.Timer;

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
    this.isPush = false;
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

  getRandomWordInGroup() {
    const randomWord = Math.floor(Math.random() * 600);
    return this.wordsInGroup[randomWord];
  }

  pushBtnSound = () => {
    playSound(this.currentWord);
  };

  // async pushBtnTrue(target: HTMLElement | null) {
  //   if (target && target.tagName === 'BUTTON') {
  //     const textTranslate = document.querySelector('.sprint__translate');
  //     if (textTranslate) {
  //       if (this.currentWord.wordTranslate === textTranslate.innerHTML) {
  //         const sound = new Audio();
  //         sound.src = 'assets/sounds/success.mp3';
  //         sound.autoplay = true;
  //         this.storage.inRow += 1;
  //         this.storage.setInRow.add(this.storage.inRow);
  //         if (this.storage.inRow <= 3) {
  //           this.storage.score += 10;
  //         }
  //         if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
  //           this.storage.score += 20;
  //         }
  //         if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
  //           this.storage.score += 40;
  //         }
  //         if (this.storage.inRow >= 10) {
  //           this.storage.score += 80;
  //         }
  //         this.storage.countAnswerCorrect += 1;
  //         this.storage.namesAnswerCorrect.push(this.currentWord.word);
  //         this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
  //         this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);
  //       } else {
  //         const sound = new Audio();
  //         sound.src = 'assets/sounds/fail.mp3';
  //         sound.autoplay = true;
  //         this.storage.inRow = 0;
  //         this.storage.countAnswerWrong += 1;
  //         this.storage.namesAnswerWrong.push(this.currentWord.word);
  //         this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
  //         this.storage.namesAnswerWrongSound.push(`${api.base}/${this.currentWord.audio}`);
  //       }
  //       const counterScore = document.querySelector('.sprint__score');
  //       if (counterScore) {
  //         counterScore.innerHTML = `${this.storage.score}`;
  //       }
  //       clearInterval(this.timer);
  //       document.removeEventListener('keydown', this.findButton);

  //       const userId = userService.getStoredUserId();
  //       if (userId) {
  //         const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
  //         if (userWord && userWord.optional) {
  //           const bodyUserWord = {
  //             difficulty: userWord.difficulty,
  //             optional: Object.assign({}, userWord.optional),
  //           };

  //           const sum: number = userWord.optional.games.sprint.right + 1;
  //           bodyUserWord.optional.games.sprint.right = sum;

  //           await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
  //         }
  //       }

  //       this.sprint.remove();
  //       new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
  //     }
  //   }
  // }

  // async pushBtnFalse(target: HTMLElement | null) {
  //   if (target && target.tagName === 'BUTTON') {
  //     const textTranslate = document.querySelector('.sprint__translate');
  //     if (textTranslate) {
  //       if (this.currentWord.wordTranslate !== textTranslate.innerHTML) {
  //         const sound = new Audio();
  //         sound.src = 'assets/sounds/success.mp3';
  //         sound.autoplay = true;
  //         this.storage.inRow += 1;
  //         this.storage.setInRow.add(this.storage.inRow);
  //         if (this.storage.inRow <= 3) {
  //           this.storage.score += 10;
  //         }
  //         if (this.storage.inRow >= 4 && this.storage.inRow <= 6) {
  //           this.storage.score += 20;
  //         }
  //         if (this.storage.inRow >= 7 && this.storage.inRow <= 9) {
  //           this.storage.score += 40;
  //         }
  //         if (this.storage.inRow >= 10) {
  //           this.storage.score += 80;
  //         }
  //         this.storage.countAnswerCorrect += 1;
  //         this.storage.namesAnswerCorrect.push(this.currentWord.word);
  //         this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
  //         this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);
  //       } else {
  //         const sound = new Audio();
  //         sound.src = 'assets/sounds/fail.mp3';
  //         sound.autoplay = true;
  //         this.storage.inRow = 0;
  //         this.storage.countAnswerWrong += 1;
  //         this.storage.namesAnswerWrong.push(this.currentWord.word);
  //         this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
  //         this.storage.namesAnswerWrongSound.push(`${api.base}/${this.currentWord.audio}`);
  //       }
  //       const counterScore = document.querySelector('.sprint__score');
  //       if (counterScore) {
  //         counterScore.innerHTML = `${this.storage.score}`;
  //       }
  //       clearInterval(this.timer);
  //       document.removeEventListener('keydown', this.findButton);

  //       const userId = userService.getStoredUserId();
  //       if (userId) {
  //         const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
  //         if (userWord && userWord.optional) {
  //           const bodyUserWord = {
  //             difficulty: userWord.difficulty,
  //             optional: Object.assign({}, userWord.optional),
  //           };

  //           const sum: number = userWord.optional.games.sprint.wrong + 1;
  //           bodyUserWord.optional.games.sprint.wrong = sum;

  //           await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
  //         }
  //       }

  //       this.sprint.remove();
  //       new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
  //     }
  //   }
  // }

  pressLeft = async () => {
    document.removeEventListener('keydown', this.findButton);
    document.removeEventListener('click', this.pressRight);
    document.removeEventListener('click', this.pressLeft);
    if (!this.isPush) {
      this.isPush = true;
      const textTranslate = document.querySelector('.sprint__translate');
      if (textTranslate) {
        if (this.currentWord.wordTranslate !== textTranslate.innerHTML) {
          const sound = new Audio();
          sound.src = 'assets/sounds/success.mp3';
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
          this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);

          const userId = userService.getStoredUserId();
          if (userId) {
            const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
            if (userWord && userWord.optional) {
              const bodyUserWord = {
                difficulty: userWord.difficulty,
                optional: Object.assign({}, userWord.optional),
              };

              const sum: number = userWord.optional.games.sprint.right + 1;
              bodyUserWord.optional.games.sprint.right = sum;

              await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
            }
          }
        } else {
          const sound = new Audio();
          sound.src = 'assets/sounds/fail.mp3';
          sound.autoplay = true;
          this.storage.inRow = 0;
          this.storage.countAnswerWrong += 1;
          this.storage.namesAnswerWrong.push(this.currentWord.word);
          this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerWrongSound.push(`${api.base}/${this.currentWord.audio}`);

          const userId = userService.getStoredUserId();
          if (userId) {
            const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
            if (userWord && userWord.optional) {
              const bodyUserWord = {
                difficulty: userWord.difficulty,
                optional: Object.assign({}, userWord.optional),
              };
              const sum: number = userWord.optional.games.sprint.wrong + 1;
              bodyUserWord.optional.games.sprint.wrong = sum;

              await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
            }
          }
        }
        const counterScore = document.querySelector('.sprint__score');
        if (counterScore) {
          counterScore.innerHTML = `${this.storage.score}`;
        }
        clearInterval(this.timer);

        this.sprint.remove();
        new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
      }
    }
  };

  pressRight = async () => {
    document.removeEventListener('keydown', this.findButton);
    document.removeEventListener('click', this.pressRight);
    document.removeEventListener('click', this.pressLeft);
    if (!this.isPush) {
      this.isPush = true;
      const textTranslate = document.querySelector('.sprint__translate');
      if (textTranslate) {
        if (this.currentWord.wordTranslate === textTranslate.innerHTML) {
          const sound = new Audio();
          sound.src = 'assets/sounds/success.mp3';
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
          this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);

          const userId = userService.getStoredUserId();
          if (userId) {
            const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
            if (userWord && userWord.optional) {
              const bodyUserWord = {
                difficulty: userWord.difficulty,
                optional: Object.assign({}, userWord.optional),
              };

              const sum: number = userWord.optional.games.sprint.right + 1;
              bodyUserWord.optional.games.sprint.right = sum;

              await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
            }
          }
        } else {
          const sound = new Audio();
          sound.src = 'assets/sounds/fail.mp3';
          sound.autoplay = true;
          this.storage.inRow = 0;
          this.storage.countAnswerWrong += 1;
          this.storage.namesAnswerWrong.push(this.currentWord.word);
          this.storage.namesAnswerWrongTranslate.push(this.currentWord.wordTranslate);
          this.storage.namesAnswerWrongSound.push(`${api.base}/${this.currentWord.audio}`);

          const userId = userService.getStoredUserId();
          if (userId) {
            const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
            if (userWord && userWord.optional) {
              const bodyUserWord = {
                difficulty: userWord.difficulty,
                optional: Object.assign({}, userWord.optional),
              };

              const sum: number = userWord.optional.games.sprint.wrong + 1;
              bodyUserWord.optional.games.sprint.wrong = sum;

              await wordsApiService.updateUserWord(userId, this.currentWord.id, bodyUserWord);
            }
          }
        }
        const counterScore = document.querySelector('.sprint__score');
        if (counterScore) {
          counterScore.innerHTML = `${this.storage.score}`;
        }
        clearInterval(this.timer);

        this.sprint.remove();
        new Sprint(this.root, this.wordsInGroup, this.storage, this.seconds).render();
      }
    }
  };

  findButton = async (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      this.pressRight();
    }
    if (event.key === 'ArrowLeft') {
      this.pressLeft();
    }
  };

  async render() {
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
    if (imgBox) {
      imgBox.innerHTML = '+10';
      if (this.storage.inRow > 2 && this.storage.inRow <= 5) {
        imgBox.innerHTML = '+20';
      }
      if (this.storage.inRow > 5 && this.storage.inRow <= 8) {
        imgBox.innerHTML = '+40';
      }
      if (this.storage.inRow >= 9) {
        imgBox.innerHTML = '+80';
      }
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

    const userId = userService.getStoredUserId();
    if (userId) {
      const userWord = await wordsApiService.getUserWordByID(userId, this.currentWord.id);
      if (!userWord) {
        const body = {
          difficulty: 'easy',
          optional: {
            games: {
              audioCall: {
                right: 0,
                wrong: 0,
              },
              sprint: {
                right: 0,
                wrong: 0,
              },
            },
          },
        };
        this.storage.newWords += 1;
        await wordsApiService.addUserWord(userId, this.currentWord.id, body);

        const userStatObj = await statisticApiService.getUserStatistics(userId);
        if (!userStatObj) {
          const defaultUserStatObj: UserStatistics = {
            learnedWords: 0,
            optional: {
              [dateToday]: 0,
            },
          };
          await statisticApiService.saveUserStatistics(userId, defaultUserStatObj);
        } else {
          if (userStatObj.optional) {
            if (Object.keys(userStatObj.optional).some((el) => el === dateToday)) {
              userStatObj.optional[dateToday] += 1;
            } else {
              userStatObj.optional[dateToday] = 1;
            }

            userStatObj.learnedWords += 1;
            delete userStatObj.id;

            await statisticApiService.saveUserStatistics(userId, userStatObj);
          }
        }
      }
    }

    const btnSound = document.querySelector('.sprint__button-sound');
    if (btnSound) {
      btnSound.addEventListener('click', this.pushBtnSound);
    }

    const btnFalse = document.querySelector('.sprint__button-false');
    if (btnFalse) {
      btnFalse.addEventListener('click', this.pressLeft, { once: true });
    }

    const btnTrue = document.querySelector('.sprint__button-true');
    if (btnTrue) {
      btnTrue.addEventListener('click', this.pressRight, { once: true });
    }

    document.addEventListener('keydown', this.findButton);

    return this.sprint;
  }
}
