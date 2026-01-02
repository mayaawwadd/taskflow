import ActivityLog from '../models/activityLog.model.js';

export const logActivity = async ({
    actor,
    action,
    entityType,
    entityId,
    metadata = {},
}) => {
    try {
        await ActivityLog.create({
            actor,
            action,
            entityType,
            entityId,
            metadata,
        });
    } catch (error) {
        console.error('Activity log failed:', error.message);
    }
};
