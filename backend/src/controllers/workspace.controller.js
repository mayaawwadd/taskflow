import Workspace from '../models/workspace.model.js';
import WorkspaceMember from '../models/workspaceMember.model.js';

/* ========== CREATE WORKSPACE ========== */
export const createWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Workspace name is required' });
        }

        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user._id,
        });

        // Add owner as member
        await WorkspaceMember.create({
            workspace: workspace._id,
            user: req.user._id,
            role: 'owner',
        });

        res.status(201).json({ workspace });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== GET MY WORKSPACES ========== */
export const getMyWorkspaces = async (req, res) => {
    try {
        const memberships = await WorkspaceMember.find({
            user: req.user._id,
            isDeleted: false,
        }).populate('workspace');

        const workspaces = memberships
            .map((m) => m.workspace)
            .filter((w) => !w.isDeleted);

        res.status(200).json({ workspaces });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
