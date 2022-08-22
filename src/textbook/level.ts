import layoutTextBook from './layoutTextBook';

class Level {
  private readonly level: HTMLButtonElement;
  constructor(name: string, numbers: string, id: string, index: number) {
    this.level = document.createElement('button');
    this.level.classList.add(`level`);
    this.level.classList.add(`${id}`);
    this.level.id = id;
    this.level.innerHTML = `
      <div class="level__name">
        <h2 class='level__header'>${name}</h2>
        <p class='level__word-number'>${numbers}</p>
      </div>
      <div class='level__value'>
        ${id}
      </div>
    `;
    this.level.addEventListener('click', () => {
      new layoutTextBook().addWords(1, index);
    });
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.level);
  }
}

export default Level;
