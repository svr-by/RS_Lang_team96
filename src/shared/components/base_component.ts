export default class BaseComponent {
  readonly element: HTMLElement;

  readonly className: string[];

  constructor(
    private readonly root: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string[] = [],
    contentText = ''
  ) {
    this.element = document.createElement(tag);
    this.className = className;
    this.element.innerHTML = contentText;
  }

  render(): HTMLElement {
    this.root.appendChild(this.element);
    if (this.className.length !== 0) {
      this.element.classList.add(...this.className);
    }

    return this.element;
  }
}
