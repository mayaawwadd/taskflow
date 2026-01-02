import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        entityType: {
            type: String,
            enum: ['workspace', 'board', 'list', 'card'],
            required: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        metadata: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
