import Board from '../models/board.model.js';
import BoardMember from '../models/boardMember.model.js';
import WorkspaceMember from '../models/workspaceMember.model.js';
import { logActivity } from '../utils/activityLogger.js';

/* ================= CREATE BOARD ================= */
export const createBoard = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, visibility = 'workspace' } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Board title is required' });
        }

        // Ensure user is workspace member
        const workspaceMember = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!workspaceMember) {
            return res.status(403).json({ message: 'Not a workspace member' });
        }

        // Create board
        const board = await Board.create({
            title,
            description,
            visibility,
            workspace: workspaceId,
            createdBy: req.user._id,
        });

        // Add creator as board owner
        await BoardMember.create({
            board: board._id,
            user: req.user._id,
            role: 'owner',
            addedBy: req.user._id,
        });

        await logActivity({
            actor: req.user._id,
            action: 'board_created',
            entityType: 'board',
            entityId: board._id,
            metadata: {
                title: board.title,
                description: board.description || null,
                workspace: workspaceId,
                visibility: board.visibility,
            },
        });

        res.status(201).json({ board });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET BOARDS IN WORKSPACE ================= */
export const getBoardsByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Ensure user is workspace member
        const workspaceMember = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!workspaceMember) {
            return res.status(403).json({ message: 'Not a workspace member' });
        }

        // Fetch boards
        const boards = await Board.find({
            workspace: workspaceId,
            isDeleted: false,
        }).sort({ createdAt: -1 });

        res.status(200).json({ boards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET SINGLE BOARD ================= */
export const getBoardById = async (req, res) => {
    try {
        const { boardId } = req.params;

        // Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'No access to this board' });
        }

        // Fetch board
        const board = await Board.findOne({
            _id: boardId,
            isDeleted: false,
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.status(200).json({ board });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE BOARD (SOFT DELETE) ================= */
export const deleteBoard = async (req, res) => {
    try {
        const { boardId } = req.params;

        // Check board membership & role
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership || membership.role !== 'owner') {
            return res
                .status(403)
                .json({ message: 'Only board owner can delete board' });
        }

        // Find board
        const board = await Board.findOne({
            _id: boardId,
            isDeleted: false,
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Soft delete
        board.isDeleted = true;
        board.deletedAt = new Date();
        board.updatedBy = req.user._id;
        await board.save();

        await logActivity({
            actor: req.user._id,
            action: 'board_deleted',
            entityType: 'board',
            entityId: board._id,
        });

        res.status(200).json({ message: 'Board deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
