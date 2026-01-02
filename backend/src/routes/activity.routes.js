import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getBoardActivity,
    getWorkspaceActivity,
} from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/boards/:boardId/activity', getBoardActivity);
router.get('/workspaces/:workspaceId/activity', getWorkspaceActivity);

export default router;
