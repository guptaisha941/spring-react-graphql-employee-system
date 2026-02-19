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

// Validate required environment variables
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const EMPLOYEE_API_URL = process.env.EMPLOYEE_API_URL;

if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is required');
  process.exit(1);
}

if (!EMPLOYEE_API_URL) {
  console.error('ERROR: EMPLOYEE_API_URL environment variable is required');
  process.exit(1);
}

// Simple logger utility
const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
};

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      logger.error('GraphQL Error:', err.message, err.extensions);
      return {
        message: err.message,
        extensions: err.extensions,
      };
    },
  });

  await server.start();

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(authMiddleware);

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

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  logger.info(`GraphQL gateway ready at http://localhost:${PORT}/graphql`);
}

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
