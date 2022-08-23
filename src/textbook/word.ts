class Word {
  private readonly newWord: HTMLDivElement;
  constructor(id: string, word: string, wordTranslate: string) {
    this.newWord = document.createElement('div');
    this.newWord.className = 'word';
    this.newWord.id = id;
    this.newWord.innerHTML = `
        <p class = 'word__english'>${word}</p>
        <p class = 'word__russian russian'>${wordTranslate}</p>
        `;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.newWord);
  }
}

export default Word;
