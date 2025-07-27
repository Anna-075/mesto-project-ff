// Включение валидации всех форм
export function enableValidation(config) {
    const forms = document.querySelectorAll(config.formSelector);
    forms.forEach(form => {
        form.setAttribute('novalidate', true);
        setupFormValidation(form, config);
    });
}

// Настройка валидации для одной формы
function setupFormValidation(form, config) {
    const inputs = form.querySelectorAll(config.inputSelector);
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            checkInputValidity(form, input, config);
            toggleButtonState(inputs, button, config.inactiveButtonClass);
        });
    });

    toggleButtonState(inputs, button, config.inactiveButtonClass);
}

// Проверка валидности поля
function checkInputValidity(form, input, config) {
    const errorElement = form.querySelector(`#${input.id}-error`);
    input.setCustomValidity('');
    
    if (input.validity.valueMissing) {
        input.setCustomValidity('Вы пропустили это поле');
    } 
    else if (input.type === 'url' && input.validity.typeMismatch) {
        input.setCustomValidity('Введите адрес сайта');
    }
    else if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage || "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы");
    }

    if (!input.validity.valid) {
        showInputError(input, errorElement, config);
    } else {
        hideInputError(input, errorElement, config);
    }
    
    errorElement.textContent = input.validationMessage;
}

// Показать ошибку
function showInputError(input, errorElement, { inputErrorClass, errorClass }) {
    input.classList.add(inputErrorClass);
    if (errorElement) {
        errorElement.textContent = input.validationMessage;
        errorElement.classList.add(errorClass);
    }
}

// Скрыть ошибку
function hideInputError(input, errorElement, { inputErrorClass, errorClass }) {
    input.classList.remove(inputErrorClass);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove(errorClass);
    }
}

// Переключение состояния кнопки
function toggleButtonState(inputs, button, inactiveButtonClass) {
    const isValid = Array.from(inputs).every(input => input.validity.valid);
    if (button) {
        button.disabled = !isValid;
        button.classList.toggle(inactiveButtonClass, !isValid);
    }
}

// Очистка валидации
export function clearValidation(form, config) {
    const inputs = form.querySelectorAll(config.inputSelector);
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => {
        const errorElement = form.querySelector(`#${input.id}-error`);
        hideInputError(input, errorElement, config);
        input.setCustomValidity('');
    });

    toggleButtonState(inputs, button, config.inactiveButtonClass);
} 
