import Description from './description';
import Storage from '../../shared/services/storage';

class Word {
  private readonly newWord: HTMLDivElement;
  private descriptionWord: Description;
  private storage: Storage;
  constructor(id: string, word: string, wordTranslate: string) {
    this.descriptionWord = new Description();
    this.storage = new Storage();
    this.newWord = document.createElement('div');
    this.newWord.className = 'word';
    this.newWord.id = id;
    this.newWord.innerHTML = `
        <p class = 'word__english'>${word}</p>
        <p class = 'word__russian russian'>${wordTranslate}</p>
        `;

    if (this.storage.get('chosenWordId') === this.newWord.id) {
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
    this.storage.set('chosenWordId', id);
    (document.querySelector('.word-background') as HTMLElement).classList.remove('word-background');
    this.newWord.classList.add('word-background');
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.newWord);
  }
}

export default Word;
