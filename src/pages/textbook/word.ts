import Description from './description';
import { storageService } from '../../shared/services/storageService';
import { IAggregatedWord } from '../../shared/interfaces';

class Word {
  private readonly newWord: HTMLDivElement;
  private descriptionWord: Description;
  private readonly hardWords: IAggregatedWord[] | undefined;
  private readonly learnedWords: IAggregatedWord[] | undefined;
  constructor(
    id: string,
    word: string,
    wordTranslate: string,
    hardWords?: IAggregatedWord[],
    learnedWords?: IAggregatedWord[]
  ) {
    this.descriptionWord = new Description();
    this.hardWords = hardWords;
    this.learnedWords = learnedWords;
    this.newWord = document.createElement('div');
    this.newWord.className = 'word';
    this.newWord.id = id;
    this.newWord.innerHTML = `
        <p class = 'word__english'>${word}</p>
        <p class = 'word__russian russian'>${wordTranslate}</p>
        `;

    if (this.hardWords) {
      if (this.hardWords.find((item) => item._id === id)) {
        this.newWord.classList.add('hard-word');
      }
    }

    if (this.learnedWords) {
      if (this.learnedWords.find((item) => item._id === id)) {
        this.newWord.classList.add('learned-word');
      }
    }

    if (storageService.getSession('chosenWordId') === this.newWord.id) {
      this.newWord.setAttribute('data-background-color', 'true');
      this.newWord.classList.add('word-background');
    }

    this.newWord.addEventListener('click', () => {
      this.chooseWord(id);
    });
  }

  chooseWord(id: string) {
    const descriptionBlock = document.getElementById('description') as HTMLElement;
    this.descriptionWord.appendTo(descriptionBlock, id);
    storageService.setSession('chosenWordId', id);
    (document.querySelector('.word-background') as HTMLElement).classList.remove('word-background');
    this.newWord.classList.add('word-background');
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.newWord);
  }
}

export default Word;
