import Workspace from '../models/workspace.model.js';
import WorkspaceMember from '../models/workspaceMember.model.js';
import User from '../models/user.model.js';
import { getUserWorkspaceRole } from '../utils/workspaceAuth.js';
import { logActivity } from '../utils/activityLogger.js';

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

        await logActivity({
            actor: req.user._id,
            action: 'workspace_created',
            entityType: 'workspace',
            entityId: workspace._id,
            metadata: {
                name: workspace.name,
            },
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

/* ========== GET WORKSPACE MEMBERS ========== */
export const getWorkspaceMembers = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const members = await WorkspaceMember.find({
            workspace: workspaceId,
            isDeleted: false,
        }).populate('user', 'firstName lastName email');

        res.status(200).json({ members });
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

        // Check inviter role
        const inviterRole = await getUserWorkspaceRole(
            workspaceId,
            req.user._id
        );

        if (!['owner', 'admin'].includes(inviterRole)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Find user
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check existing membership (including deleted)
        const existing = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userToInvite._id,
        });

        if (existing && !existing.isDeleted) {
            return res.status(409).json({
                message: 'User already a member of this workspace',
            });
        }

        if (existing && existing.isDeleted) {
            // Reactivate membership
            existing.isDeleted = false;
            existing.role = role;
            existing.addedBy = req.user._id;
            await existing.save();

            return res.status(200).json({ member: existing });
        }

        // Create membership
        const member = await WorkspaceMember.create({
            workspace: workspaceId,
            user: userToInvite._id,
            role,
        });

        await logActivity({
            actor: req.user._id,
            action: 'workspace_member_invited',
            entityType: 'workspace',
            entityId: workspaceId,
            metadata: {
                invitedUser: userToInvite._id,
                role,
            },
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

        // Check remover role
        const removerRole = await getUserWorkspaceRole(
            workspaceId,
            req.user._id
        );

        if (!['owner', 'admin'].includes(removerRole)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get membership
        const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userId,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Prevent removing owner
        if (membership.role === 'owner') {
            return res
                .status(400)
                .json({ message: 'Owner cannot be removed' });
        }

        // Soft remove
        membership.isDeleted = true;
        membership.removedBy = req.user._id;
        await membership.save();

        await logActivity({
            actor: req.user._id,
            action: 'workspace_member_removed',
            entityType: 'workspace',
            entityId: workspaceId,
            metadata: {
                removedUser: userId,
            },
        });

        res.status(200).json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== UPDATE WORKSPACE MEMBER ROLE ========== */
export const updateWorkspaceMemberRole = async (req, res) => {
    try {
        const { workspaceId, userId } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Only owner/admin can change roles
        const requester = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!requester || !['owner', 'admin'].includes(requester.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userId,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (membership.role === 'owner') {
            return res.status(400).json({ message: 'Owner role cannot be changed' });
        }

        membership.role = role;
        membership.updatedBy = req.user._id;
        await membership.save();

        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== DELETE WORKSPACE ========== */
export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Find workspace
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace || workspace.isDeleted) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Only owner can delete
        if (workspace.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can delete workspace' });
        }

        // Soft delete
        workspace.isDeleted = true;
        workspace.deletedAt = new Date();
        await workspace.save();

        await logActivity({
            actor: req.user._id,
            action: 'workspace_deleted',
            entityType: 'workspace',
            entityId: workspace._id,
        });

        res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
