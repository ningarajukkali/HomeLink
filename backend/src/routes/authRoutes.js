import express from 'express';
import {
  login,
  register,
  sendOtp,
  getMe,
  updateProfile,
  getAllUsers,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/send-otp', sendOtp);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);
router.get('/users', getAllUsers);

export default router;
