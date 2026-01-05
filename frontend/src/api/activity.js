import api from './axios';

export const fetchWorkspaceActivity = async (workspaceId) => {
    const res = await api.get(`/workspaces/${workspaceId}/activity`);
    return res.data.activity;
};

export const fetchBoardActivity = async (boardId) => {
    const res = await api.get(`/boards/${boardId}/activity`);
    return res.data.activity;
};
