import api from './axios';

/* ================= LISTS ================= */

// Get lists for a board
export const fetchListsByBoard = async (boardId) => {
    const res = await api.get(`/boards/${boardId}/lists`);
    return res.data.lists;
};

// Create list
export const createList = async (boardId, payload) => {
    const res = await api.post(`/boards/${boardId}/lists`, payload);
    return res.data.list;
};

// Delete list
export const deleteList = async (listId) => {
    const res = await api.delete(`/lists/${listId}`);
    return res.data;
};

// Reorder lists
export const reorderLists = async (boardId, orderedListIds) => {
    const res = await api.put(`/boards/${boardId}/lists/reorder`, {
        orderedListIds,
    });
    return res.data;
};
