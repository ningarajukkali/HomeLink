import express from 'express';
import propertyRoutes from './propertyRoutes.js';
import roommateRoutes from './roommateRoutes.js';
import roommateRequestRoutes from './roommateRequestRoutes.js';
import conversationRoutes from './conversationRoutes.js';
import savedRoutes from './savedRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import reportRoutes from './reportRoutes.js';
import authRoutes from './authRoutes.js';
import aiRoutes from './aiRoutes.js';
import visitRoutes from './visitRoutes.js';

const apiRouter = express.Router();

// Root API Health & Info
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'HomeLink API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/properties',
      '/api/roommates',
      '/api/roommate-requests',
      '/api/conversations',
      '/api/saved',
      '/api/notifications',
      '/api/reports',
      '/api/auth',
      '/api/ai',
    ]
  });
});

// Resource Routers for New Frontend
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/rooms', propertyRoutes); // Alias for backwards compatibility
apiRouter.use('/roommates', roommateRoutes);
apiRouter.use('/roommate-requests', roommateRequestRoutes);
apiRouter.use('/conversations', conversationRoutes);
apiRouter.use('/saved', savedRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/visits', visitRoutes);

export default apiRouter;
