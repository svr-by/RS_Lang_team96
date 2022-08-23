import { NewElement } from '../types';

class LayoutService {
  createElement({ tag, text, classes, id }: NewElement): HTMLElement {
    const elem = document.createElement(tag);
    if (text) elem.innerText = text;
    if (classes) elem.classList.add(...classes);
    if (id) elem.id = id;
    return elem;
  }
}

export const layoutService = new LayoutService();
