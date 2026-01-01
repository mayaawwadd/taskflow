import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createWorkspace,
    getMyWorkspaces,
    inviteMember,
    removeMember,
    deleteWorkspace
} from '../controllers/workspace.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createWorkspace);
router.get('/', getMyWorkspaces);
router.post('/:workspaceId/invite', inviteMember);
router.delete('/:workspaceId/members/:userId', removeMember);
router.delete('/:workspaceId', deleteWorkspace);

export default router;
