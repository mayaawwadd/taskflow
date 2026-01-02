import List from '../models/list.model.js';
import BoardMember from '../models/boardMember.model.js';
import { logActivity } from '../utils/activityLogger.js';

/* ================= CREATE LIST ================= */
export const createList = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'List name is required' });
        }

        // Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // Get next order
        const lastList = await List.findOne({
            board: boardId,
            isDeleted: false,
        }).sort({ order: -1 });

        const nextOrder = lastList ? lastList.order + 1 : 1;

        // Create list
        const list = await List.create({
            board: boardId,
            name,
            order: nextOrder,
            createdBy: req.user._id,
        });

        await logActivity({
            actor: req.user._id,
            action: 'list_created',
            entityType: 'list',
            entityId: list._id,
            metadata: {
                board: boardId,
                name: list.name,
                order: list.order,
            },
        });

        res.status(201).json({ list });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET LISTS BY BOARD ================= */
export const getListsByBoard = async (req, res) => {
    try {
        const { boardId } = req.params;

        // Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // Fetch lists
        const lists = await List.find({
            board: boardId,
            isDeleted: false,
        }).sort({ order: 1 });

        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE LIST ================= */
export const deleteList = async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await List.findOne({
            _id: listId,
            isDeleted: false,
        });

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const membership = await BoardMember.findOne({
            board: list.board,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        list.isDeleted = true;
        list.deletedAt = new Date();
        list.updatedBy = req.user._id;
        await list.save();

        await logActivity({
            actor: req.user._id,
            action: 'list_deleted',
            entityType: 'list',
            entityId: list._id,
            metadata: {
                board: list.board,
            },
        });

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= REORDER LISTS ================= */
export const reorderLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { orderedListIds } = req.body;

        if (!Array.isArray(orderedListIds)) {
            return res.status(400).json({
                message: 'orderedListIds must be an array',
            });
        }

        // Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // Bulk update list orders
        const bulkOps = orderedListIds.map((listId, index) => ({
            updateOne: {
                filter: { _id: listId, board: boardId, isDeleted: false },
                update: {
                    order: index + 1,
                    updatedBy: req.user._id,
                },
            },
        }));

        await List.bulkWrite(bulkOps);

        await logActivity({
            actor: req.user._id,
            action: 'lists_reordered',
            entityType: 'board',
            entityId: boardId,
            metadata: {
                listCount: orderedListIds.length,
            },
        });

        res.status(200).json({ message: 'Lists reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
