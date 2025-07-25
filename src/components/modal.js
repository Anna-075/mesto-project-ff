import { clearValidation } from './validation.js';

// Открытие модального окна
export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

// Закрытие модального окна
export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

// Закрытие модального окна нажатием esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
      document.removeEventListener('keydown', handleEscClose);
    }
  }
}

// Подготовка формы к валидации
export function prepareForm(formElement, validationConfig, initialValues = {}) {
    Object.entries(initialValues).forEach(([name, value]) => {
        const input = formElement.querySelector(`[name="${name}"]`);
        if (input) input.value = value;
    });
    
    if (Object.keys(initialValues).length === 0) {
        formElement.reset();
    }

    clearValidation(formElement, validationConfig, initialValues);
}
