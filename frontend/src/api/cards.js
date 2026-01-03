import api from './axios';

/* ================= CARDS ================= */

// Get cards for a list
export const fetchCardsByList = async (listId) => {
    const res = await api.get(`/lists/${listId}/cards`);
    return res.data.cards;
};

// Create card
export const createCard = async (listId, payload) => {
    const res = await api.post(`/lists/${listId}/cards`, payload);
    return res.data.card;
};

// Move card
export const moveCard = async (cardId, payload) => {
    const res = await api.patch(`/cards/${cardId}/move`, payload);
    return res.data;
};

// Delete card
export const deleteCard = async (cardId) => {
    const res = await api.delete(`/cards/${cardId}`);
    return res.data;
};

// Update card
export const updateCard = async (cardId, payload) => {
    const res = await api.patch(`/cards/${cardId}`, payload);
    return res.data.card;
};

