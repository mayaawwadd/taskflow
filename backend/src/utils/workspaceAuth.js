import WorkspaceMember from '../models/workspaceMember.model.js';

export const getUserWorkspaceRole = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId,
        isDeleted: false,
    });

    return membership ? membership.role : null;
};
