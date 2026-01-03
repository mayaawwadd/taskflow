import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceMembers,
    inviteMember,
    removeMember,
    deleteWorkspace
} from '../controllers/workspace.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createWorkspace);
router.get('/', getMyWorkspaces);
router.get('/:workspaceId/members', getWorkspaceMembers);
router.post('/:workspaceId/invite', inviteMember);
router.delete('/:workspaceId/members/:userId', removeMember);
router.delete('/:workspaceId', deleteWorkspace);

export default router;
