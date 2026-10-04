import express from 'express';
import {
  createReport,
  blockUser,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', createReport);
router.post('/block', blockUser);

export default router;
