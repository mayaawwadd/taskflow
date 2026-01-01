import Workspace from '../models/workspace.model.js';
import WorkspaceMember from '../models/workspaceMember.model.js';
import User from '../models/user.model.js';
import { getUserWorkspaceRole } from '../utils/workspaceAuth.js';

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

/* ========== INVITE MEMBER ========== */
export const inviteMember = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role = 'member' } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // 1️⃣ Check inviter role
        const inviterRole = await getUserWorkspaceRole(
            workspaceId,
            req.user._id
        );

        if (!['owner', 'admin'].includes(inviterRole)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 2️⃣ Find user
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3️⃣ Prevent duplicate membership
        const existing = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userToInvite._id,
            isDeleted: false,
        });

        if (existing) {
            return res
                .status(409)
                .json({ message: 'User already a member' });
        }

        // 4️⃣ Create membership
        const member = await WorkspaceMember.create({
            workspace: workspaceId,
            user: userToInvite._id,
            role,
        });

        res.status(201).json({ member });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== REMOVE MEMBER ========== */
export const removeMember = async (req, res) => {
    try {
        const { workspaceId, userId } = req.params;

        // 1️⃣ Check remover role
        const removerRole = await getUserWorkspaceRole(
            workspaceId,
            req.user._id
        );

        if (!['owner', 'admin'].includes(removerRole)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 2️⃣ Get membership
        const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userId,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // 3️⃣ Prevent removing owner
        if (membership.role === 'owner') {
            return res
                .status(400)
                .json({ message: 'Owner cannot be removed' });
        }

        // 4️⃣ Soft remove
        membership.isDeleted = true;
        membership.removedBy = req.user._id;
        await membership.save();

        res.status(200).json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== DELETE WORKSPACE ========== */
export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // 1️⃣ Find workspace
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace || workspace.isDeleted) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // 2️⃣ Only owner can delete
        if (workspace.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can delete workspace' });
        }

        // 3️⃣ Soft delete
        workspace.isDeleted = true;
        workspace.deletedAt = new Date();
        await workspace.save();

        res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
