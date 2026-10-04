import express from 'express';
import {
  getConversations,
  sendMessage,
} from '../controllers/chatController.js';

const router = express.Router();

router.route('/conversations')
  .get(getConversations);

router.route('/messages')
  .post(sendMessage);

export default router;
