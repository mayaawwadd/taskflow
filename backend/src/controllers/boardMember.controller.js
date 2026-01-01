import BoardMember from '../models/boardMember.model.js';
import Board from '../models/board.model.js';
import User from '../models/user.model.js';

/* ========== INVITE BOARD MEMBER ========== */
export const inviteBoardMember = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { email, role = 'member' } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // 1️⃣ Check inviter role
        const inviter = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!inviter || !['owner', 'admin'].includes(inviter.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 2️⃣ Find user
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3️⃣ Prevent duplicates
        const existing = await BoardMember.findOne({
            board: boardId,
            user: userToInvite._id,
            isDeleted: false,
        });

        if (existing) {
            return res.status(409).json({ message: 'User already on board' });
        }

        // 4️⃣ Add member
        const member = await BoardMember.create({
            board: boardId,
            user: userToInvite._id,
            role,
            addedBy: req.user._id,
        });

        res.status(201).json({ member });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== REMOVE BOARD MEMBER ========== */
export const removeBoardMember = async (req, res) => {
    try {
        const { boardId, userId } = req.params;

        // 1️⃣ Check remover role
        const remover = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            isDeleted: false,
        });

        if (!remover || !['owner', 'admin'].includes(remover.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 2️⃣ Find membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: userId,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // 3️⃣ Prevent removing owner
        if (membership.role === 'owner') {
            return res.status(400).json({ message: 'Owner cannot be removed' });
        }

        // 4️⃣ Soft delete
        membership.isDeleted = true;
        membership.removedBy = req.user._id;
        await membership.save();

        res.status(200).json({ message: 'Board member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ========== CHANGE BOARD MEMBER ROLE ========== */
export const changeBoardMemberRole = async (req, res) => {
    try {
        const { boardId, userId } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // 1️⃣ Only owner can change roles
        const owner = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
            role: 'owner',
            isDeleted: false,
        });

        if (!owner) {
            return res.status(403).json({ message: 'Only owner can change roles' });
        }

        // 2️⃣ Find member
        const membership = await BoardMember.findOne({
            board: boardId,
            user: userId,
            isDeleted: false,
        });

        if (!membership) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // 3️⃣ Update role
        membership.role = role;
        membership.updatedBy = req.user._id;
        await membership.save();

        res.status(200).json({ message: 'Role updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
