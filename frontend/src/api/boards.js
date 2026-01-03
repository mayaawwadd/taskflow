import api from './axios';

/* ================= BOARDS ================= */

export const fetchBoardsByWorkspace = async (workspaceId) => {
    const res = await api.get(`/workspaces/${workspaceId}/boards`);
    return res.data.boards;
};

export const createBoard = async (workspaceId, payload) => {
    const res = await api.post(`/workspaces/${workspaceId}/boards`, payload);
    return res.data.board;
};

export const deleteBoard = async (boardId) => {
    const res = await api.delete(`/boards/${boardId}`);
    return res.data;
};

export const fetchBoardById = async (boardId) => {
    const res = await api.get(`/boards/${boardId}`);
    return res.data.board;
};
