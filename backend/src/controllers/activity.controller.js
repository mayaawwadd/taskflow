import ActivityLog from '../models/activityLog.model.js';
import BoardMember from '../models/boardMember.model.js';
import WorkspaceMember from '../models/workspaceMember.model.js';
import { formatActivity } from '../utils/activityFormatter.js';

/* ================= BOARD ACTIVITY ================= */
export const getBoardActivity = async (req, res) => {
    try {
        const { boardId } = req.params;

        // Permission check
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch activity
        const activity = await ActivityLog.find({
            $or: [
                { entityType: 'board', entityId: boardId },
                { entityType: 'list', 'metadata.board': boardId },
                { entityType: 'card', 'metadata.board': boardId },
            ],
        })
            .populate('actor', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(50);

        const formatted = activity.map(formatActivity);
        res.status(200).json({ activity: formatted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= WORKSPACE ACTIVITY ================= */
export const getWorkspaceActivity = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Permission check
        const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch activity
        const activity = await ActivityLog.find({
            $or: [
                { entityType: 'workspace', entityId: workspaceId },
                { 'metadata.workspace': workspaceId },
            ],
        })
            .populate('actor', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(50);

        const formatted = activity.map(formatActivity);
        res.status(200).json({ activity: formatted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
