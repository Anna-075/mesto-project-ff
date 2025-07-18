import { likeCard, unlikeCard, deleteCardFromServer } from './api.js';

// Создание одной карточки
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

    // Инициализация состояния лайка
    const isLiked = cardBox.likes.some(like => like._id === userId);
    if (isLiked) {
        likeButton.classList.add('card__like-button_is-active');
    }

    cardImage.addEventListener('click', () => {
        handleImageClick(cardBox);
    });

    if (cardBox.owner._id !== userId) {
        deleteButton.style.display = 'none';
    } else {
        deleteButton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            deleteCard(cardElement, cardBox._id);
        });
    }

    const updateLikeCount = (count) => {
        likeCount.textContent = count;
    };

    likeButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        const currentIsLiked = likeButton.classList.contains('card__like-button_is-active');
        switchLike(likeButton, cardBox._id, currentIsLiked, updateLikeCount, userId);
    });

    return cardElement;
}

// Удаление одной карточки
export function deleteCard(cardElement, cardId) {
    deleteCardFromServer(cardId)
        .then(() => {
            cardElement.remove();
        })
        .catch(err => {
            console.error('Ошибка при удалении карточки:', err);
        });
}


// Лайк карточки
export function switchLike(button, cardId, isCurrentlyLiked, updateLikeCount, userId) {
    const currentCount = parseInt(button.closest('.card').querySelector('.card__like-count').textContent);
    const newCount = isCurrentlyLiked ? currentCount - 1 : currentCount + 1;
    updateLikeCount(newCount);
    button.classList.toggle('card__like-button_is-active');
    
    const likeAction = isCurrentlyLiked ? unlikeCard(cardId) : likeCard(cardId);
    
    likeAction
        .then(updatedCard => {
            if (!updatedCard || !updatedCard.likes) {
                throw new Error('Invalid server response');
            }
            
            updateLikeCount(updatedCard.likes.length);
            
            const isNowLiked = updatedCard.likes.some(like => like._id === userId);
            if (isNowLiked !== !isCurrentlyLiked) {
                button.classList.toggle('card__like-button_is-active');
            }
        })
        .catch(err => {
            console.error('Ошибка при обновлении лайка:', err);
            updateLikeCount(currentCount);
            button.classList.toggle('card__like-button_is-active');
        });
}
