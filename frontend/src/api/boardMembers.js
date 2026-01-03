import api from './axios';

/* ================= BOARD MEMBERS ================= */

export const fetchBoardMembers = async (boardId) => {
    const res = await api.get(`/boards/${boardId}/members`);
    return res.data.members;
};

export const inviteBoardMember = async (boardId, payload) => {
    const res = await api.post(`/boards/${boardId}/invite`, payload);
    return res.data.member;
};

export const updateBoardMemberRole = async (boardId, userId, role) => {
    const res = await api.patch(`/boards/${boardId}/members/${userId}`, { role });
    return res.data;
};

export const removeBoardMember = async (boardId, userId) => {
    const res = await api.delete(`/boards/${boardId}/members/${userId}`);
    return res.data;
};
