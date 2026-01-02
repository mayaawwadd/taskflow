export const formatActivity = (log) => {
    const actorName = log.actor
        ? `${log.actor.firstName} ${log.actor.lastName}`
        : 'Someone';

    let message = 'performed an action';

    switch (log.action) {
        /* ===== AUTH ===== */
        case 'user_registered':
            message = `${actorName} joined TaskFlow`;
            break;

        case 'user_logged_in':
            message = `${actorName} logged in`;
            break;

        /* ===== WORKSPACES ===== */
        case 'workspace_created':
            message = `${actorName} created a workspace`;
            break;

        case 'workspace_deleted':
            message = `${actorName} deleted a workspace`;
            break;

        case 'workspace_member_invited':
            message = `${actorName} invited a member to the workspace`;
            break;

        case 'workspace_member_removed':
            message = `${actorName} removed a member from the workspace`;
            break;

        /* ===== BOARDS ===== */
        case 'board_created':
            message = `${actorName} created a board`;
            break;

        case 'board_deleted':
            message = `${actorName} deleted a board`;
            break;

        case 'board_member_invited':
            message = `${actorName} invited a member to the board`;
            break;

        case 'board_member_removed':
            message = `${actorName} removed a member from the board`;
            break;

        case 'board_member_role_changed':
            message = `${actorName} changed a board member’s role`;
            break;

        /* ===== LISTS ===== */
        case 'list_created':
            message = `${actorName} added a list`;
            break;

        case 'list_deleted':
            message = `${actorName} deleted a list`;
            break;

        case 'lists_reordered':
            message = `${actorName} reordered lists`;
            break;

        /* ===== CARDS ===== */
        case 'card_created':
            message = `${actorName} added a card`;
            break;

        case 'card_moved':
            message = `${actorName} moved a card`;
            break;

        case 'card_deleted':
            message = `${actorName} deleted a card`;
            break;

        default:
            message = `${actorName} performed an action`;
    }

    return {
        id: log._id,
        message,
        action: log.action,
        actor: log.actor,
        entityType: log.entityType,
        entityId: log.entityId,
        metadata: log.metadata,
        createdAt: log.createdAt,
    };
};
