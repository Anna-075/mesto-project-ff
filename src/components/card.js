// Создание одной карточки
export function addCard(cardBox, deleteCard, switchLike, handleImageClick) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = cardBox.link;
    cardImage.alt = cardBox.name;
    cardTitle.textContent = cardBox.name;

    deleteButton.addEventListener('click', () => {
        deleteCard(cardElement);
    });

    likeButton.addEventListener('click', () => {
        switchLike(likeButton);
    });

    cardImage.addEventListener('click', () => {
        handleImageClick(cardBox);
    });

    return cardElement;
}

// Удаление одной карточки
export function deleteCard(cardElement) {
    cardElement.remove();  
}

// Лайк карточки
export function switchLike(button) {
    button.classList.toggle('card__like-button_is-active');
}