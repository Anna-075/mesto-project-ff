import { likeCard, unlikeCard, deleteCardFromServer } from './api.js';

// Создание карточки 
export function addCard(cardBox, deleteCard, switchLike, handleImageClick, userId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    cardImage.src = cardBox.link;
    cardImage.alt = cardBox.name;
    cardTitle.textContent = cardBox.name;
    likeCount.textContent = cardBox.likes.length;

    const isLiked = cardBox.likes.some(like => like._id === userId);
    if (isLiked) {
        likeButton.classList.add('card__like-button_is-active');
    }

    cardImage.addEventListener('click', () => handleImageClick(cardBox));

    if (cardBox.owner._id === userId) {
        deleteButton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            deleteCard(cardElement, cardBox._id);
        });
    } else {
        deleteButton.style.display = 'none';
    }

    likeButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        switchLike(likeButton, cardBox._id, isLiked, userId);
    });

    return cardElement;
}

// Удаление карточки с подтверждением от сервера
export function deleteCard(cardElement, cardId) {
    deleteCardFromServer(cardId)
        .then(() => {
            cardElement.remove();
        })
        .catch(err => {
            console.error('Ошибка при удалении карточки:', err);
        });
}

// Обновление лайков с подтверждением от сервера
export function switchLike(button, cardId, isLiked, userId) {
    button.disabled = true;

    const likeAction = isLiked ? unlikeCard(cardId) : likeCard(cardId);
    const likeCountElement = button.closest('.card').querySelector('.card__like-count');
    
    likeAction
        .then(updatedCard => {
            likeCountElement.textContent = updatedCard.likes.length;
            button.classList.toggle('card__like-button_is-active');
        })
        .catch(err => {
            console.error('Ошибка при обновлении лайка:', err);
        })
        .finally(() => {
            button.disabled = false;
        });
}
