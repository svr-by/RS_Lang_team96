class SettingsModal {
  private readonly settingsModal: HTMLDivElement;
  constructor() {
    this.settingsModal = document.createElement('div');
    this.settingsModal.className = 'settings-modal display-none';
    this.settingsModal.id = 'settings-modal';
    this.settingsModal.innerHTML = `
      <h2 class='settings-modal__header'>Настройки</h2>
      <div class='russian-on-off'>
        <input type="checkbox" id='toggle' name='toggle' class='russian-on-off__checkbox'>
        <label class='russian-on-off__checkbox-label' for='toggle'>
        <p class='russian-on-off__description'>Скрыть перевод слова и перевод предложения</p>
      </div>
    `;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.settingsModal);
  }
}

export default SettingsModal;
