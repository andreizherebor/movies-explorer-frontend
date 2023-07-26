import { MAIN_BASE_URL, CARDS_IMAGE_BASE_URL } from '../config/config';

export const checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
};

export const registerUser = (name, email, password) => {
    return fetch(`${MAIN_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
    })
        .then((res) => checkResponse(res));
}

export const loginUser = (email, password) => {
    return fetch(`${MAIN_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
        .then((res) => checkResponse(res))
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data;
            }
        })
};

export const getContent = (token) => {
    return fetch(`${MAIN_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => checkResponse(res))
}

export const getUserInfo = (token) => {
    return fetch(`${MAIN_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((res) => checkResponse(res))
}

export const editUserInfo = (userName, userEmail, token) => {
    return fetch(`${MAIN_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
        }),
    }).then((res) => checkResponse(res))
}

export const getSavedMovies = (token) => {
    return fetch(`${MAIN_BASE_URL}/movies`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => checkResponse(res))
}

export const saveMoviesCard = (card, token) => {
    return fetch(`${MAIN_BASE_URL}/movies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            country: card.country,
            director: card.director,
            duration: card.duration,
            year: card.year,
            description: card.description,
            image: `${CARDS_IMAGE_BASE_URL}${card.image.url}`,
            trailerLink: card.trailerLink,
            thumbnail: `${CARDS_IMAGE_BASE_URL}${card.image.formats.thumbnail.url}`,
            movieId: card.id,
            nameRU: card.nameRU,
            nameEN: card.nameEN,
        }),
    }).then((res) => checkResponse(res))
}

export const deleteMoviesCard = (cardId, token) => {
    return fetch(`${MAIN_BASE_URL}/movies/${cardId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => checkResponse(res))
}

