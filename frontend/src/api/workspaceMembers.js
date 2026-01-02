import api from './axios';

/* ================= WORKSPACE MEMBERS ================= */

export const fetchWorkspaceMembers = async (workspaceId) => {
    const res = await api.get(`/workspaces/${workspaceId}/members`);
    return res.data.members;
};

export const inviteWorkspaceMember = async (workspaceId, email) => {
    const res = await api.post(`/workspaces/${workspaceId}/invite`, { email });
    return res.data.member;
};

export const removeWorkspaceMember = async (workspaceId, userId) => {
    const res = await api.delete(
        `/workspaces/${workspaceId}/members/${userId}`
    );
    return res.data;
};

export const updateWorkspaceMemberRole = async (
    workspaceId,
    userId,
    role
) => {
    const res = await api.patch(
        `/workspaces/${workspaceId}/members/${userId}`,
        { role }
    );
    return res.data;
};
