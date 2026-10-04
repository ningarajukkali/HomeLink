import express from 'express';
import { chatWithAI, searchAI, verifyPhotoAuthenticity } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithAI);
router.post('/search', searchAI);
router.post('/verify-photo', verifyPhotoAuthenticity);

export default router;
