import express from 'express';
import {
  saveProperty,
  unsaveProperty,
  getSavedProperties,
  saveRoommate,
  unsaveRoommate,
  getSavedRoommates,
} from '../controllers/savedController.js';

const router = express.Router();

router.post('/properties/:id', saveProperty);
router.delete('/properties/:id', unsaveProperty);
router.get('/properties', getSavedProperties);

router.post('/roommates/:id', saveRoommate);
router.delete('/roommates/:id', unsaveRoommate);
router.get('/roommates', getSavedRoommates);

export default router;
