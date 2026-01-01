import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createBoard,
    getBoardsByWorkspace,
    getBoardById,
    deleteBoard,
} from '../controllers/board.controller.js';

const router = express.Router();

router.use(authMiddleware);

// Boards under a workspace
router.post('/workspaces/:workspaceId/boards', createBoard);
router.get('/workspaces/:workspaceId/boards', getBoardsByWorkspace);

// Single board actions
router.get('/boards/:boardId', getBoardById);
router.delete('/boards/:boardId', deleteBoard);

export default router;
