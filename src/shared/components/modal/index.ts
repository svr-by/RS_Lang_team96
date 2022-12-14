import { layoutService } from '../../services/layoutService';

export class Modal {
  elem: HTMLElement;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['modal'] });
    this.elem.addEventListener('click', (event) => this.closeModalHandler(event));
  }

  showModal(content: HTMLElement) {
    this.closeOtherModal();
    this.elem.innerHTML = '';
    const wrapper = layoutService.createElement({ tag: 'div', classes: ['modal__wrapper'] });
    wrapper.append(content);
    const removeBtn = layoutService.createElement({ tag: 'button', text: '✖', classes: ['modal__btn-remove'] });
    wrapper.append(removeBtn);
    this.elem.append(wrapper);
    document.body.append(this.elem);
  }

  closeModal() {
    this.elem.remove();
  }

  private closeModalHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target?.classList.contains('modal__btn-remove') || target?.classList.value === 'modal') {
      this.closeModal();
    }
  }

  private closeOtherModal() {
    const otherModal = document.querySelector('.modal');
    if (otherModal) otherModal.remove();
  }
}
