import './pages/index.css';
import { addCard, deleteCard, switchLike, initDeleteConfirmation } from './components/card.js';
import { openModal, closeModal, prepareForm } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

import { getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  deleteCardFromServer, 
  likeCard, 
  unlikeCard, 
  updateAvatar 
} from './components/api.js';

// DOM элементы
const placesList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const formEdit = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const formAdd = document.querySelector('.popup__form[name="new-place"]');
const placeInput = document.querySelector('.popup__input_type_card-name');
const linkInput = document.querySelector('.popup__input_type_url');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput = document.querySelector('.popup__input_type_avatar-url');
const profileImage = document.querySelector('.profile__image');
const profileAvatar = document.querySelector('.profile__image');

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации
enableValidation(validationConfig);

// Инициализация карточек
function renderCards(cards, userId) {
    placesList.innerHTML = '';
    cards.forEach(card => {
        const cardElement = addCard(card, deleteCard, switchLike, handleImageClick, userId);
        placesList.append(cardElement);
    });
}

// Функция обновления данных на странице
function updateProfileInfo(userData) {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
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

  addNewCard(name, link)
    .then(cardData => {
      const cardElement = addCard(cardData, deleteCard, switchLike, handleImageClick, cardData.owner._id);
      placesList.prepend(cardElement);
      closeModal(addPopup);
      formAdd.reset();
      clearValidation(formAdd, validationConfig);
    })
    .catch(err => {
      console.error('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
    });
});

// Открытие модальных окон
editButton.addEventListener('click', () => {
    prepareForm(formEdit, validationConfig, {
        name: profileName.textContent,
        description: profileJob.textContent
    });
    openModal(editPopup);
});

addButton.addEventListener('click', () => {
    prepareForm(formAdd, validationConfig);
    openModal(addPopup);
});

// Открытие модального окна с картинкой
function handleImageClick(cardBox) {
    popupImage.src = cardBox.link;
    popupImage.alt = cardBox.name;
    popupCaption.textContent = cardBox.name;
    openModal(imagePopup);
}

// Закрытие попапов
document.querySelectorAll('.popup__close').forEach(button => {
  button.addEventListener('click', (e) => {
    const modal = e.target.closest('.popup');
    closeModal(modal);
  });
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

// Обработка аватара
profileImage.addEventListener('click', () => {
    prepareForm(avatarForm, validationConfig);
    openModal(avatarPopup);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  const submitButton = avatarForm.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  updateAvatar(avatarInput.value.trim())
    .then(userData => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
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
