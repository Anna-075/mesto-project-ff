const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-42", 
  headers: {
    authorization: "ed00eefe-4c09-4ee0-93c8-16744cef6ae5",
    "Content-Type": "application/json",
  },
};

function request(url, method = "GET", body = null) {
  const options = {
    method,
    headers: config.headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${config.baseUrl}${url}`, options)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
}

// Функция для получения данных пользователя
function getUserInfo() {
  return request('/users/me');
}

// Получение карточек
function getInitialCards() {
  return request("/cards"); 
}

// Обновление пользовательской информации
function updateUserInfo(name, about) {
  return request('/users/me', 'PATCH', { name, about });
}

// Добавление новой карточки
function addNewCard(name, link) {
  return request('/cards', 'POST', { name, link });
}

// Удаление карточки
function deleteCardFromServer(cardId) {
  return request(`/cards/${cardId}`, 'DELETE');
}

// Поставить лайк
function likeCard(cardId) {
  return request(`/cards/${cardId}/likes`, 'PUT');
}

// Удалить лайк
function unlikeCard(cardId) {
  return request(`/cards/${cardId}/likes`, 'DELETE');
}

// Обновление аватара пользователя
function updateAvatar(avatarUrl) {
  return request('/users/me/avatar', 'PATCH', { avatar: avatarUrl });
}

export { 
  config,
  request,
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCardFromServer,
  likeCard,
  unlikeCard,
  updateAvatar
};
