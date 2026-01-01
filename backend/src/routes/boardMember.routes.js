import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    inviteBoardMember,
    removeBoardMember,
    changeBoardMemberRole,
} from '../controllers/boardMember.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/boards/:boardId/members', inviteBoardMember);
router.delete('/boards/:boardId/members/:userId', removeBoardMember);
router.patch('/boards/:boardId/members/:userId', changeBoardMemberRole);

export default router;
