import app from './app.js';
import config from './config/config.js';
import connectDB from './config/db.js';

// Connect Database (if configured in .env)
connectDB();

const server = app.listen(config.port, () => {
  console.log(`
🚀 ========================================================
   HomeLink Backend API Server is running!
   Mode:        ${config.nodeEnv}
   Port:        ${config.port}
   API URL:     http://localhost:${config.port}/api
   Health:      http://localhost:${config.port}/api/health
   Frontend:    ${config.clientUrl}
======================================================== 🚀
  `);
});

// Graceful process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
