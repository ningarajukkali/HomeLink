import express from 'express';
import {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from '../controllers/roommateRequestController.js';

const router = express.Router();

router.post('/', sendRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.patch('/:id/accept', acceptRequest);
router.patch('/:id/decline', declineRequest);
router.patch('/:id/cancel', cancelRequest);

export default router;
