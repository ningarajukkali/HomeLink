import express from 'express';
import {
  scheduleVisit,
  getMyVisits,
  updateVisitStatus,
} from '../controllers/visitController.js';

const router = express.Router();

router.route('/')
  .post(scheduleVisit);

router.route('/my-visits')
  .get(getMyVisits);

router.route('/:id/status')
  .patch(updateVisitStatus);

export default router;
