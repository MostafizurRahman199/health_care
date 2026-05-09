import app from './app';
import config from './config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Server is running on port: ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();

// Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Rejection. Shutting down...', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception. Shutting down...', error);
  process.exit(1);
});
