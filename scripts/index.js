// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

//удаление карточки
function handleCardDelete(cardElement) {
    cardElement.remove();  
}

//добавление одной карточки
function addCard(cardBox, deleteCallback) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardBox.link;
    cardImage.alt = cardBox.name;
    cardTitle.textContent = cardBox.name;

    deleteButton.addEventListener('click', () => {
        deleteCallback(cardElement);
    });

    return cardElement;
}

//куда добавлять
const placesList = document.querySelector('.places__list');

//добавление всех карточек (6 штук)
initialCards.forEach(cardBox => {
    const cardElement = addCard(cardBox, handleCardDelete);
    placesList.appendChild(cardElement);
});