class Word {
  private readonly newWord: HTMLDivElement;
  constructor(id: string, word: string, wordTranslate: string) {
    this.newWord = document.createElement('div');
    this.newWord.id = id;
    this.newWord.innerHTML = `
        <p class = 'words__english'>${word}</p>
        <p class = 'words__russian'>${wordTranslate}</p>
        `;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.newWord);
  }
}

export default Word;
