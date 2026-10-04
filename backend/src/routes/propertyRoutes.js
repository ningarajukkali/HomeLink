import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updatePropertyStatus,
  compareProperties,
  uploadPropertyPhoto,
  getCities,
} from '../controllers/propertyController.js';

const router = express.Router();

// Search, cities, and comparison must be defined before /:id param route
router.get('/cities', getCities);
router.get('/search', getProperties);
router.get('/compare', compareProperties);
router.get('/:id', getPropertyById);
router.get('/', getProperties);
router.post('/', createProperty);
router.patch('/:id/status', updatePropertyStatus);
router.post('/:id/photos', uploadPropertyPhoto);

export default router;
