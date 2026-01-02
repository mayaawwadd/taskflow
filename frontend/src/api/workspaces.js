import api from './axios';

export const fetchWorkspaces = async () => {
    const res = await api.get('/workspaces');
    return res.data.workspaces;
};

export const createWorkspace = async (payload) => {
    const res = await api.post('/workspaces', payload);
    return res.data.workspace;
};
