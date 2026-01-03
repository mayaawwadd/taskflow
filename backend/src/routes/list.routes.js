import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createList,
    getListsByBoard,
    deleteList,
    reorderLists,
} from '../controllers/list.controller.js';

const router = express.Router();

router.use(authMiddleware);

// Lists under a board
router.post('/boards/:boardId/lists', createList);
router.get('/boards/:boardId/lists', getListsByBoard);
router.delete('/lists/:listId', deleteList);
router.put('/boards/:boardId/lists/reorder', reorderLists);

export default router;
