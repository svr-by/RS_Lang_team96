export class Modal {
  elem: HTMLElement;

  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('modal');
  }

  showModal(content: HTMLElement) {
    this.removeModal();
    const wrapper = document.createElement('div');
    wrapper.classList.add('modal__wrapper');
    wrapper.append(content);
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('modal__btn-remove');
    removeBtn.innerHTML = '✖';
    wrapper.append(removeBtn);
    this.elem.append(wrapper);
    document.body.append(this.elem);
    document.body.classList.add('noscroll');
    this.elem.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target?.classList.contains('modal__btn-remove') || target?.classList.value === 'modal') this.removeModal();
    });
  }

  removeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
      document.body.classList.remove('noscroll');
    }
  }
}
