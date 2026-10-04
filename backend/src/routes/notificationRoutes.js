import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markNotificationRead);

export default router;
