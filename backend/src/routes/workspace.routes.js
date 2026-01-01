import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createWorkspace,
    getMyWorkspaces,
} from '../controllers/workspace.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createWorkspace);
router.get('/', getMyWorkspaces);

export default router;
