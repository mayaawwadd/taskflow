import List from '../models/list.model.js';
import BoardMember from '../models/boardMember.model.js';

/* ================= CREATE LIST ================= */
export const createList = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'List name is required' });
        }

        // 1️⃣ Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // 2️⃣ Get next order
        const lastList = await List.findOne({
            board: boardId,
            isDeleted: false,
        }).sort({ order: -1 });

        const nextOrder = lastList ? lastList.order + 1 : 1;

        // 3️⃣ Create list
        const list = await List.create({
            board: boardId,
            name,
            order: nextOrder,
            createdBy: req.user._id,
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

        // 1️⃣ Check board membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // 2️⃣ Fetch lists
        const lists = await List.find({
            board: boardId,
            isDeleted: false,
        }).sort({ order: 1 });

        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE LIST (SOFT DELETE) ================= */
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

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
