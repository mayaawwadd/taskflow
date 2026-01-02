import Card from '../models/card.model.js';
import List from '../models/list.model.js';
import BoardMember from '../models/boardMember.model.js';
import { logActivity } from '../utils/activityLogger.js';

/* ================= CREATE CARD ================= */
export const createCard = async (req, res) => {
    try {
        const { listId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Card name is required' });
        }

        const list = await List.findById(listId);
        if (!list || list.isDeleted) {
            return res.status(404).json({ message: 'List not found' });
        }

        // Check board membership
        const membership = await BoardMember.findOne({
            board: list.board,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        // Get next order
        const lastCard = await Card.findOne({
            list: listId,
            isDeleted: false,
        }).sort({ order: -1 });

        const nextOrder = lastCard ? lastCard.order + 1 : 1;

        const card = await Card.create({
            list: listId,
            name,
            order: nextOrder,
            createdBy: req.user._id,
        });

        await logActivity({
            actor: req.user._id,
            action: 'card_created',
            entityType: 'card',
            entityId: card._id,
            metadata: {
                list: listId,
                order: card.order,
                name: card.name,
            },
        });

        res.status(201).json({ card });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET CARDS BY LIST ================= */
export const getCardsByList = async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await List.findById(listId);
        if (!list || list.isDeleted) {
            return res.status(404).json({ message: 'List not found' });
        }

        const membership = await BoardMember.findOne({
            board: list.board,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a board member' });
        }

        const cards = await Card.find({
            list: listId,
            isDeleted: false,
        }).sort({ order: 1 });

        res.status(200).json({ cards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= MOVE / REORDER CARD ================= */
export const moveCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { listId, order } = req.body;

        const card = await Card.findById(cardId);
        if (!card || card.isDeleted) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const list = await List.findById(listId);
        if (!list || list.isDeleted) {
            return res.status(404).json({ message: 'Target list not found' });
        }

        const membership = await BoardMember.findOne({
            board: list.board,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        card.list = listId;
        card.order = order;
        card.updatedBy = req.user._id;
        await card.save();

        await logActivity({
            actor: req.user._id,
            action: 'card_moved',
            entityType: 'card',
            entityId: card._id,
            metadata: {
                toList: listId,
                newOrder: order,
            },
        });


        res.status(200).json({ message: 'Card moved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE CARD (SOFT DELETE) ================= */
export const deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;

        const card = await Card.findById(cardId);
        if (!card || card.isDeleted) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const list = await List.findById(card.list);

        const membership = await BoardMember.findOne({
            board: list.board,
            user: req.user._id,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        card.isDeleted = true;
        card.deletedAt = new Date();
        card.deletedBy = req.user._id;
        await card.save();

        await logActivity({
            actor: req.user._id,
            action: 'card_deleted',
            entityType: 'card',
            entityId: card._id,
            metadata: {
                list: card.list,
            },
        });

        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
