require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { authMiddleware, validateJWT } = require('./middleware');
const logger = require('./utils/logger');

// Validate required environment variables
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const EMPLOYEE_API_URL = process.env.EMPLOYEE_API_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

if (!JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

if (JWT_SECRET.length < 32) {
  logger.warn('JWT_SECRET should be at least 32 characters long for security');
}

if (!EMPLOYEE_API_URL) {
  logger.error('EMPLOYEE_API_URL environment variable is required');
  process.exit(1);
}

// Request logging middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
}

// Security headers middleware
function securityHeaders(req, res, next) {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Hide server information
  res.removeHeader('X-Powered-By');
  
  next();
}

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  // Security headers
  app.use(securityHeaders);

  // Request logging (only in development)
  if (!isProduction) {
    app.use(requestLogger);
  }

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsOptions = {
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(origin => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // Body parser
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'graphql-gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Auth middleware
  app.use(authMiddleware);

  // Apollo Server configuration
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      // Log full error details in development, sanitize in production
      if (isProduction) {
        logger.error('GraphQL Error:', err.message);
        // In production, don't expose internal error details
        return {
          message: err.message,
          extensions: {
            code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        };
      } else {
        logger.error('GraphQL Error:', err.message, err.extensions);
        return {
          message: err.message,
          extensions: err.extensions,
        };
      }
    },
    introspection: !isProduction, // Disable introspection in production
    csrfPrevention: true,
  });

  await server.start();

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : null;

        // Validate JWT token before executing resolvers
        // This will throw GraphQLError if token is missing or invalid
        const user = validateJWT(token);

        return {
          user,
          token, // Pass token string to resolvers for API calls
        };
      },
    })
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    logger.error('Express Error:', err.message, err.stack);
    res.status(err.status || 500).json({
      error: isProduction ? 'Internal Server Error' : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    });
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, starting graceful shutdown...`);
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  logger.info(`GraphQL gateway ready at http://localhost:${PORT}/graphql`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
}

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
