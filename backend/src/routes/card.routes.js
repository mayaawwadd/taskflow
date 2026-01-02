import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    createCard,
    getCardsByList,
    moveCard,
    deleteCard,
} from '../controllers/card.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/lists/:listId/cards', createCard);
router.get('/lists/:listId/cards', getCardsByList);
router.patch('/cards/:cardId/move', moveCard);
router.delete('/cards/:cardId', deleteCard);

export default router;
