export class Button {
  elem: HTMLButtonElement;

  constructor(text: string, classes?: string[]) {
    this.elem = document.createElement('button');
    this.elem.innerText = `${text}`;
    if (classes) this.elem.classList.add(...classes);
  }

  appendToParent(selector: string) {
    const parent = document.querySelector(selector);
    if (parent) parent.appendChild(this.elem);
  }

  updateText(text: string) {
    this.elem.innerText = `${text}`;
  }
}
