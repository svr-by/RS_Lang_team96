import BaseComponent from '../../../shared/components/base_component';
import AnswerBox from '../audio-challenge/components/answer-box';
import Result from '../audio-challenge/components/result';
import playSound from '../utility/play-sound';
import { api } from '../../../api/api';
import { UserStatistics } from '../../../shared/types';
import { IWord, IAggregatedWord, IStorage } from '../../../shared/interfaces';
import { userService } from '../../../shared/services/userService';
import { wordsApiService } from '../../../api/wordsApiService';
import { statisticApiService } from '../../../api/statisticApiService';
import { dateToday } from '../../../shared/services/dateService';

export default class AudioChallange {
  audioChallange: HTMLElement;
  containerPanel: HTMLElement;
  currentWord: IWord | IAggregatedWord;
  isPush: boolean;

  constructor(
    private readonly root: HTMLElement,
    public wordsInGroup: IWord[] | IAggregatedWord[],
    public currentCountWord: string,
    public storage: IStorage
  ) {
    this.audioChallange = document.createElement('div');
    this.containerPanel = document.createElement('div');
    this.wordsInGroup = wordsInGroup;
    this.currentWord = this.getRandomCurrentWord();
    this.isPush = false;
  }

  getRandomCurrentWord(): IWord | IAggregatedWord {
    const randomIndex = Math.floor(Math.random() * this.wordsInGroup.length);
    return this.wordsInGroup.splice(randomIndex, 1)[0];
  }

  getRandomWordInGroup(): IWord | IAggregatedWord {
    const randomIndex = Math.floor(Math.random() * this.wordsInGroup.length);
    return this.wordsInGroup[randomIndex];
  }

  pushBtnSound = (): void => {
    playSound(this.currentWord);
  };

  pushBtnSkipNext(target: HTMLElement | null) {
    if (target && target.tagName === 'DIV') {
      const audioChallange: HTMLElement | null = document.querySelector('.main__games__audio-challange');
      const main: HTMLElement | null = document.querySelector('.main__games');
      if (audioChallange && main) {
        this.currentCountWord = (+this.currentCountWord + 1).toString();
        if (+this.currentCountWord > 20 || this.currentWord === undefined || this.wordsInGroup.length < 5) {
          this.audioChallange.innerHTML = '';
          const result = new Result(this.storage).render();
          this.audioChallange.append(result);
        } else {
          audioChallange.remove();
          new AudioChallange(main, this.wordsInGroup, this.currentCountWord, this.storage).render();
        }
      }
    }
  }

  async pushBtnAnswer(target: HTMLElement | null) {
    if (target && target.tagName === 'DIV') {
      if (!this.isPush) {
        this.isPush = true;
        target.classList.add('answer');
        target.setAttribute('data-answer', 'yes');
        const img = this.audioChallange.querySelector('.main__games__audio-challange-img');
        if (img) {
          img.setAttribute('src', `${api.base}/${this.currentWord.image}`);
        }
        const sound = new Audio();
        sound.src = 'assets/sounds/success.mp3';
        sound.autoplay = true;
        this.storage.inRow += 1;
        this.storage.setInRow.add(this.storage.inRow);
        this.storage.countAnswerCorrect += 1;
        this.storage.namesAnswerCorrect.push(this.currentWord.word);
        this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
        this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);

        const btnSkip: HTMLElement | null = this.audioChallange.querySelector(
          '.main__games__audio-challange-buttonSkip'
        );
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

        const userId = userService.getStoredUserId();
        if (userId) {
          const userWord = await wordsApiService.getUserWordByID(userId, (this.currentWord as IAggregatedWord)._id);
          if (userWord && userWord.optional) {
            const bodyUserWord = {
              difficulty: userWord.difficulty,
              optional: Object.assign({}, userWord.optional),
            };

            const sum: number = userWord.optional.games.audioCall.right + 1;
            bodyUserWord.optional.games.audioCall.right = sum;

            await wordsApiService.updateUserWord(userId, (this.currentWord as IAggregatedWord)._id, bodyUserWord);
          }
        }
      }
    }
  }

  async pushBtnWrong(target: HTMLElement | null) {
    if (target && target.tagName === 'DIV') {
      if (!this.isPush) {
        this.isPush = true;
        target.setAttribute('data-answer', 'no');
        const img = this.audioChallange.querySelector('.main__games__audio-challange-img');
        if (img) {
          img.setAttribute('src', `${api.base}/${this.currentWord.image}`);
        }
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
          const userWord = await wordsApiService.getUserWordByID(userId, (this.currentWord as IAggregatedWord)._id);
          if (userWord && userWord.optional) {
            const bodyUserWord = {
              difficulty: userWord.difficulty,
              optional: Object.assign({}, userWord.optional),
            };

            const sum: number = userWord.optional.games.audioCall.wrong + 1;
            bodyUserWord.optional.games.audioCall.wrong = sum;

            await wordsApiService.updateUserWord(userId, (this.currentWord as IAggregatedWord)._id, bodyUserWord);
          }
        }
      }
    }
  }

  async render() {
    this.root.appendChild(this.audioChallange);
    this.audioChallange.classList.add('main__games__audio-challange');

    if (this.currentWord) {
      new BaseComponent(this.audioChallange, 'img', ['main__games__audio-challange-img'])
        .render()
        .setAttribute('src', 'assets/svg/question.svg');
      new BaseComponent(this.audioChallange, 'div', ['main__games__audio-challange-buttonSound']).render();
      new BaseComponent(
        this.audioChallange,
        'div',
        ['main__games__audio-challange-buttonSkip'],
        'ДАЛЕЕ &#10162'
      ).render();
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

      const buttonsArray = this.audioChallange.querySelectorAll('.main__games__audio-challange__buttonAnswer');

      do {
        buttonsArray[0].innerHTML = this.getRandomWordInGroup().wordTranslate;
      } while (buttonsArray[0].innerHTML === this.currentWord.wordTranslate);

      do {
        buttonsArray[1].innerHTML = this.getRandomWordInGroup().wordTranslate;
      } while (
        buttonsArray[1].innerHTML === this.currentWord.wordTranslate ||
        buttonsArray[1].innerHTML === buttonsArray[0].innerHTML
      );

      do {
        buttonsArray[2].innerHTML = this.getRandomWordInGroup().wordTranslate;
      } while (
        buttonsArray[2].innerHTML === this.currentWord.wordTranslate ||
        buttonsArray[2].innerHTML === buttonsArray[0].innerHTML ||
        buttonsArray[2].innerHTML === buttonsArray[1].innerHTML
      );

      do {
        buttonsArray[3].innerHTML = this.getRandomWordInGroup().wordTranslate;
      } while (
        buttonsArray[3].innerHTML === this.currentWord.wordTranslate ||
        buttonsArray[3].innerHTML === buttonsArray[0].innerHTML ||
        buttonsArray[3].innerHTML === buttonsArray[1].innerHTML ||
        buttonsArray[3].innerHTML === buttonsArray[2].innerHTML
      );

      for (let i = 0; i < buttonsArray.length; i++) {
        buttonsArray[i].innerHTML = `${i + 1}. ${buttonsArray[i].innerHTML}`;
      }

      const findButton = async (event: KeyboardEvent) => {
        for (let i = 1; i < 5; i++) {
          if (event.key === `${i}` && (buttonsArray[i - 1] as HTMLElement).dataset.answer !== '0') {
            if (!this.isPush) {
              this.isPush = true;
              buttonsArray[i - 1].setAttribute('data-answer', 'no');
              const img = this.audioChallange.querySelector('.main__games__audio-challange-img');
              if (img) {
                img.setAttribute('src', `${api.base}/${this.currentWord.image}`);
              }
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
                const userWord = await wordsApiService.getUserWordByID(
                  userId,
                  (this.currentWord as IAggregatedWord)._id
                );
                if (userWord && userWord.optional) {
                  const bodyUserWord = {
                    difficulty: userWord.difficulty,
                    optional: Object.assign({}, userWord.optional),
                  };

                  const sum: number = userWord.optional.games.audioCall.wrong + 1;
                  bodyUserWord.optional.games.audioCall.wrong = sum;

                  await wordsApiService.updateUserWord(userId, (this.currentWord as IAggregatedWord)._id, bodyUserWord);
                }
              }
            }
          }
          if (event.key === `${i}` && (buttonsArray[i - 1] as HTMLElement).dataset.answer === '0') {
            if (!this.isPush) {
              this.isPush = true;
              buttonsArray[i - 1].classList.add('answer');
              buttonsArray[i - 1].setAttribute('data-answer', 'yes');
              const img = this.audioChallange.querySelector('.main__games__audio-challange-img');
              if (img) {
                img.setAttribute('src', `${api.base}/${this.currentWord.image}`);
              }
              const sound = new Audio();
              sound.src = 'assets/sounds/success.mp3';
              sound.autoplay = true;
              this.storage.inRow += 1;
              this.storage.setInRow.add(this.storage.inRow);
              this.storage.countAnswerCorrect += 1;
              this.storage.namesAnswerCorrect.push(this.currentWord.word);
              this.storage.namesAnswerCorrectTranslate.push(this.currentWord.wordTranslate);
              this.storage.namesAnswerCorrectSound.push(`${api.base}/${this.currentWord.audio}`);

              const btnSkip: HTMLElement | null = this.audioChallange.querySelector(
                '.main__games__audio-challange-buttonSkip'
              );
              if (btnSkip) {
                btnSkip.classList.add('main__games__audio-challange-buttonNext');
                btnSkip.innerHTML = 'NEXT';
                const btnAnswer = buttonsArray[i - 1];
                btnAnswer.innerHTML = `
                <p>${this.currentWord.word}</p>
                <p>${this.currentWord.transcription}</p>
                <p>${this.currentWord.wordTranslate}</p>
                `;
              }

              const userId = userService.getStoredUserId();
              if (userId) {
                const userWord = await wordsApiService.getUserWordByID(
                  userId,
                  (this.currentWord as IAggregatedWord)._id
                );
                if (userWord && userWord.optional) {
                  const bodyUserWord = {
                    difficulty: userWord.difficulty,
                    optional: Object.assign({}, userWord.optional),
                  };

                  const sum: number = userWord.optional.games.audioCall.right + 1;
                  bodyUserWord.optional.games.audioCall.right = sum;

                  await wordsApiService.updateUserWord(userId, (this.currentWord as IAggregatedWord)._id, bodyUserWord);
                }
              }
            }
          }
        }
      };

      document.addEventListener('keydown', findButton);

      const userId = userService.getStoredUserId();
      if (userId) {
        const userWord = (this.currentWord as IAggregatedWord).userWord;
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
          await wordsApiService.addUserWord(userId, (this.currentWord as IAggregatedWord)._id, body);

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

      const randomNum = Math.floor(Math.random() * 4);
      const btnAnswerRight: HTMLElement | null = this.audioChallange.querySelector(`.answer-${randomNum}`);
      if (btnAnswerRight) {
        btnAnswerRight.dataset.answer = '0';
        btnAnswerRight.innerHTML = `${randomNum + 1}. ${this.currentWord.wordTranslate}`;
        btnAnswerRight.addEventListener('click', ({ target }) => this.pushBtnAnswer(target as HTMLElement), {
          once: true,
        });
      }

      buttonsArray.forEach((item) => {
        item.addEventListener('click', ({ target }) => this.pushBtnWrong(target as HTMLElement), { once: true });
      });

      const btnSound: HTMLElement | null = this.audioChallange.querySelector(
        '.main__games__audio-challange-buttonSound'
      );
      if (btnSound) {
        btnSound.addEventListener('click', this.pushBtnSound);
      }

      const btnSkip: HTMLElement | null = this.audioChallange.querySelector('.main__games__audio-challange-buttonSkip');
      if (btnSkip) {
        btnSkip.addEventListener('click', ({ target }) => this.pushBtnSkipNext(target as HTMLElement), { once: true });
      }
    }

    return this.audioChallange;
  }
}
