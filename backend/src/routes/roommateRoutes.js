import express from 'express';
import {
  getRoommates,
  getRoommateById,
  createRoommate,
  updateRoommateStatus,
} from '../controllers/roommateController.js';

const router = express.Router();

router.get('/search', getRoommates);
router.get('/:id', getRoommateById);
router.get('/', getRoommates);
router.post('/', createRoommate);
router.patch('/:id/status', updateRoommateStatus);

export default router;
