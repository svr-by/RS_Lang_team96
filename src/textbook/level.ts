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
      <p class='level__value' style='background-color: ${this.choseColor(index)}'>
        ${id}
      </p>
    `;
    this.level.addEventListener('click', () => {
      new layoutTextBook().addWords(1, index);
    });
  }

  choseColor(index: number) {
    switch (index) {
      case 0:
        return '#FFC53D';
      case 1:
        return '#9CD7F9';
      case 2:
        return '#4CCBB7';
      case 3:
        return '#FF7171';
      case 4:
        return '#5D7CFD';
      case 5:
        return '#8A78FA';
    }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.level);
  }
}

export default Level;
