import '../pages/index.css'; // импорт главного файла стилей
import { addCard, deleteCard, switchLike } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { initialCards } from './cards.js';

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

// Инициализация карточек
initialCards.forEach(cardBox => {
    const cardElement = addCard(cardBox, deleteCard, switchLike, handleImageClick);
    placesList.appendChild(cardElement);
});

// Обработка редактирования профиля
formEdit.addEventListener('submit', (evt) => {
    evt.preventDefault();

    profileName.textContent = nameInput.value;
    profileJob.textContent = jobInput.value;

    closeModal(editPopup);
});

editButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    openModal(editPopup);
});

// Обработка добавления новой карточки
formAdd.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const newCardBox = {
        name: placeInput.value,
        link: linkInput.value
    };

    const cardElement = addCard(newCardBox, deleteCard, switchLike, handleImageClick);

    placesList.prepend(cardElement);

    closeModal(addPopup);
    formAdd.reset();
});

addButton.addEventListener('click', () => openModal(addPopup));

// Открытие модального окна с картинкой
function handleImageClick(cardBox) {
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');

    popupImage.src = cardBox.link;
    popupImage.alt = cardBox.naame;
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
