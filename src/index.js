import './pages/index.css';
import { addCard, deleteCard, switchLike, initDeleteConfirmation } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, updateProfileInfo, getInitialCards, updateUserInfo, addNewCard, deleteCardFromServer, likeCard, unlikeCard, updateAvatar } from './components/api.js';

// DOM
// Куда добавлять карточку
const placesList = document.querySelector('.places__list');

// Для работы с модальными окнами
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Для редактрирование информации в модальном окне
const formEdit = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

// Для добавле6ния новой карточки
const formAdd = document.querySelector('.popup__form[name="new-place"]');
const placeInput = document.querySelector('.popup__input_type_card-name');
const linkInput = document.querySelector('.popup__input_type_url');

// Для модального окна с картинкой
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Элементы для аватара
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput = document.querySelector('.popup__input_type_avatar-url');
const avatarError = document.querySelector('#error-avatar-url');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');
const profileImage = document.querySelector('.profile__image');
const initialButtonText = avatarSubmitButton.textContent;

// Проверка URL изображения попапа автора
function isImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Инициализация карточек
function renderCards(cards, userId) {
    placesList.innerHTML = '';
    cards.forEach(card => {
        const cardElement = addCard(card, deleteCard, switchLike, handleImageClick, userId);
        placesList.append(cardElement);
    });
}

// Обработка редактирования профиля
formEdit.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const name = nameInput.value;
    const job = jobInput.value;

    const submitButton = formEdit.querySelector('.popup__button');
    const initialText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';

    updateUserInfo(name, job)
      .then(userData => {
        updateProfileInfo(userData);
        closeModal(editPopup);
      })
      .catch(err => {
        console.error('Ошибка при обновлении профиля:', err);
      })
      .finally(() => {
        submitButton.textContent = initialText;
      });
});

// Обработка добавления новой карточки
formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const name = placeInput.value;
  const link = linkInput.value;

  const submitButton = formAdd.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  addNewCard(name, link)
    .then(cardData => {
      const cardElement = addCard(cardData, deleteCard, switchLike, handleImageClick, cardData.owner._id);
      placesList.prepend(cardElement);
      closeModal(addPopup);
      formAdd.reset();
    })
    .catch(err => {
      console.error('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
});

editButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    clearValidation(formEdit, validationConfig); 
    openModal(editPopup);
});

addButton.addEventListener('click', () => {
    clearValidation(formAdd, validationConfig);
    openModal(addPopup);
});

// Открытие модального окна с картинкой
function handleImageClick(cardBox) {
    popupImage.src = cardBox.link;
    popupImage.alt = cardBox.name;
    popupCaption.textContent = cardBox.name;

    openModal(imagePopup);
}

// Закрытие по крестику
document.querySelectorAll('.popup__close').forEach(button => {
  button.addEventListener('click', (e) => {
    const modal = e.target.closest('.popup');
    closeModal(modal);
  });
});

// Закрытие попапа по оверлею
const popups = document.querySelectorAll('.popup');

popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  avatarFormSelector: '.popup__form[name="edit-avatar"]',
  avatarInputSelector: '.popup__input_type_avatar-url'
};

// Включение валидации
enableValidation(validationConfig);

//ОШИБКА ВАЛИДАЦИИ
const nameError = document.querySelector('#errorName');
const jobError = document.querySelector('#errorDescription');
const saveBtn = document.querySelector('.popup__button');

// Регулярные выражения
const reg = /^[a-zA-Zа-яА-ЯёЁ\- ]+$/;

// Функция валидации имени
function validateName() {
  const valueName = nameInput.value.trim();
  let isValid = true;

  nameError.textContent = '';
  nameError.classList.remove('visible');
  nameInput.classList.remove('invalid');

  if (valueName === '') {
    showError(nameError, 'Вы пропустили это поле');
    return false;
  }

  if (valueName.length < 2 || valueName.length > 40) {
    showError(nameError, 'Длина должна быть от 2 до 40 символов');
    return false;
  }

  if (!reg.test(valueName)) {
    showError(nameError, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
    return false;
  }

  return true;
}

// Функция валидации описания
function validateDescription() {
  const valueDescription = jobInput.value.trim();
  let isValid = true;

  jobError.textContent = '';
  jobError.classList.remove('visible');
  jobInput.classList.remove('invalid');

  if (valueDescription === '') {
    showError(jobError, 'Поле обязательно для заполнения');
    return false;
  }

  if (valueDescription.length < 2 || valueDescription.length > 200) {
    showError(jobError, 'Должно быть от 2 до 200 символов');
    return false;
  }

  if (!reg.test(valueDescription)) {
    showError(jobError, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
    return false;
  }

  return true;
}

// Вспомогательная функция для отображения ошибок
function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add('visible');
  errorElement.previousElementSibling.classList.add('invalid');
  return false;
}

// Проверка всей формы
function validateForm() {
  const isNameValid = validateName();
  const isDescriptionValid = validateDescription();
  
  saveBtn.disabled = !(isNameValid && isDescriptionValid);
  
  return isNameValid && isDescriptionValid;
}

// Обработчики событий
nameInput.addEventListener('input', () => {
  validateName();
  validateForm();
});

jobInput.addEventListener('input', () => {
  validateDescription();
  validateForm();
});

nameInput.addEventListener('blur', validateName);
jobInput.addEventListener('blur', validateDescription);

// Обработка отправки формы
formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    console.log('Форма валидна, можно сохранять');
  }
});

// Функция сброса валидации при открытии попапа
function resetFormValidation() {
  nameError.textContent = '';
  nameError.classList.remove('visible');
  nameInput.classList.remove('invalid');
  
  jobError.textContent = '';
  jobError.classList.remove('visible');
  jobInput.classList.remove('invalid');
  
  if (nameError) {
    nameError.textContent = '';
    nameError.classList.remove('visible');
  }
  if (jobError) {
    jobError.textContent = '';
    jobError.classList.remove('visible');
  }
  
  if (nameInput) {
    nameInput.classList.remove('invalid');
    nameInput.value = profileName.textContent;
  }
  if (jobInput) {
    jobInput.classList.remove('invalid');
    jobInput.value = profileJob.textContent;
  }
  
  validateForm();
}

// Вызов при открытии попапа
document.querySelector('.popup_type_edit .popup__close').addEventListener('click', resetFormValidation);

// Валидация формы добавления карточки
const cardNameError = document.querySelector('#errorPlace');
const urlError = document.querySelector('#errorUrl');
const addCardSaveBtn = formAdd.querySelector('.popup__button');

// Функция валидации названия места
function validateCardName() {
  const valuePlace = placeInput.value.trim();

  cardNameError.textContent = '';
  cardNameError.classList.remove('visible');
  placeInput.classList.remove('invalid');

  if (valuePlace === '') {
    showError(cardNameError, 'Вы пропустили это поле');
    return false;
  }

  if (valuePlace.length < 2 || valuePlace.length > 30) {
    showError(cardNameError, 'Длина должна быть от 2 до 30 символов');
    return false;
  }

  if (!reg.test(valuePlace)) {
    showError(cardNameError, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
    return false;
  }

  return true;
}

// Функция валидации ссылки
function validateUrl() {
  const valueUrl = linkInput.value.trim();

  urlError.textContent = '';
  urlError.classList.remove('visible');
  linkInput.classList.remove('invalid');

  if (valueUrl === '') {
    showError(urlError, 'Вы пропустили это поле');
    return false;
  }

  if (!linkInput.checkValidity()) {
    showError(urlError, 'Введите корректный URL');
    return false;
  }

  return true;
}

// Проверка всей формы добавления карточки
function validateAddCardForm() {
  const isCardNameValid = validateCardName();
  const isUrlValid = validateUrl();
  
  addCardSaveBtn.disabled = !(isCardNameValid && isUrlValid);
  
  return isCardNameValid && isUrlValid;
}

// Обработчики событий для формы добавления карточки
placeInput.addEventListener('input', () => {
  validateCardName();
  validateAddCardForm();
});

linkInput.addEventListener('input', () => {
  validateUrl();
  validateAddCardForm();
});

placeInput.addEventListener('blur', validateCardName);
linkInput.addEventListener('blur', validateUrl);

// Сброс валидации при открытии попапа добавления карточки
addButton.addEventListener('click', () => {
  openModal(addPopup);
  resetAddCardFormValidation();
});

// Функция сброса валидации формы добавления карточки
function resetAddCardFormValidation() {
  if (cardNameError) {
    cardNameError.textContent = '';
    cardNameError.classList.remove('visible');
  }
  
  if (placeInput) {
    placeInput.classList.remove('invalid');
  }
  
  if (urlError) {
    urlError.textContent = '';
    urlError.classList.remove('visible');
  }
  
  if (linkInput) {
    linkInput.classList.remove('invalid');
  }
  
  formAdd.reset();

  if (addCardSaveBtn) {
    addCardSaveBtn.disabled = true;
  }
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  getUserInfo()
    .then(userData => {
      updateProfileInfo(userData);
    })
    .catch(err => {
      console.error('Ошибка при загрузке данных пользователя:', err);
    });
});

// Загрузка данных
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    updateProfileInfo(userData);
    renderCards(cards, userData._id);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

// // Подтверждение удаления
// const confirmPopup = document.querySelector('.popup_type_confirm');
// const confirmForm = document.querySelector('.popup__form[name="confirm-delete"]');
// let currentCardToDelete = null;

// function showDeleteConfirmation(cardElement, cardId) {
//   currentCardToDelete = { element: cardElement, id: cardId };
//   openModal(confirmPopup);
// }

// confirmForm.addEventListener('submit', (evt) => {
//   evt.preventDefault();
  
//   deleteCardFromServer(currentCardToDelete.id)
//     .then(() => {
//       currentCardToDelete.element.remove();
//       closeModal(confirmPopup);
//     })
//     .catch(err => {
//       console.error('Ошибка при удалении карточки:', err);
//     });
// });


// Функция сброса формы аватара
function resetAvatarForm() {
  avatarForm.reset();
  avatarError.textContent = '';
  avatarError.classList.remove('popup__error_visible');
  avatarInput.classList.remove('popup__input_type_error');
  avatarSubmitButton.disabled = true;
  avatarSubmitButton.textContent = initialButtonText;
}

// Обработчик открытия попапа аватара
profileImage.addEventListener('click', () => {
  resetAvatarForm();
  openModal(avatarPopup);
});

// Валидация URL аватара
function validateAvatarUrl() {
  const valueUrl = avatarInput.value.trim();
  avatarError.textContent = '';
  avatarError.classList.remove('popup__error_visible');
  avatarInput.classList.remove('popup__input_type_error');

  if (valueUrl === '') {
    showError(avatarError, 'Вы пропустили это поле');
    return false;
  }

  try {
    const url = new URL(valueUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      showError(avatarError, 'URL должен начинаться с http:// или https://');
      return false;
    }
    return true;
  } catch {
    showError(avatarError, 'Введите корректный URL');
    return false;
  }
}

// Проверка всей формы аватара
function validateAvatarForm() {
  const isUrlValid = validateAvatarUrl();
  avatarSubmitButton.disabled = !isUrlValid;
  return isUrlValid;
}

// Обработчики событий для формы аватара
avatarInput.addEventListener('input', validateAvatarForm);
avatarInput.addEventListener('blur', validateAvatarUrl);

// Обработка отправки формы аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  if (!validateAvatarForm()) return;

  const initialText = avatarSubmitButton.textContent;
  avatarSubmitButton.textContent = 'Сохранение...';
  avatarSubmitButton.disabled = true;

  updateAvatar(avatarInput.value.trim())
    .then(userData => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(avatarPopup);
      resetAvatarForm();
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
      showError(avatarError, 'Ошибка при обновлении аватара');
      avatarSubmitButton.textContent = initialText;
    })
    .finally(() => {
      avatarSubmitButton.disabled = false;
    });
});
