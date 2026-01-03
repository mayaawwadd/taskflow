import api from './axios';

/* ================= LISTS ================= */

export const fetchListsByBoard = async (boardId) => {
    const res = await api.get(`/boards/${boardId}/lists`);
    return res.data.lists;
};

export const createList = async (boardId, payload) => {
    const res = await api.post(`/boards/${boardId}/lists`, payload);
    return res.data.list;
};

export const reorderLists = async (boardId, orderedListIds) => {
    const res = await api.patch(`/boards/${boardId}/lists/reorder`, {
        orderedListIds,
    });
    return res.data;
};

export const deleteList = async (listId) => {
    const res = await api.delete(`/lists/${listId}`);
    return res.data;
};
