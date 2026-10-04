import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import apiRouter from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware: Request Logging
if (!config.isProduction) {
  app.use(morgan('dev'));
}

// Middleware: CORS (Allows frontend requests)
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Middleware: Body Parsers (Support high-resolution photo uploads up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HomeLink API - Verified Student & Bachelor Rental Platform',
    documentation: '/api/health',
    endpoints: [
      '/api/rooms',
      '/api/visits',
      '/api/chat',
      '/api/auth'
    ]
  });
});

// Mount Master API Router
app.use('/api', apiRouter);

// 404 Handler for undefined routes
app.use(notFound);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
