const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

/**
 * Express middleware that validates JWT from Authorization header
 * and attaches decoded payload to req.user (if present).
 * Does not block requests when no token or invalid token.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    req.token = token; // Store token string for passing to resolvers
  } catch {
    // Invalid or expired token – leave req.user undefined
  }
  next();
}

/**
 * Validates JWT token and returns decoded payload
 * Throws GraphQLError if token is missing or invalid
 * @param {string} token - JWT token string
 * @returns {Object} Decoded JWT payload
 * @throws {GraphQLError} If token is missing or invalid
 */
function validateJWT(token) {
  if (!token) {
    throw new GraphQLError('Authentication required. Please provide a valid JWT token.', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new GraphQLError('JWT secret not configured', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new GraphQLError('Token has expired', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    } else if (error.name === 'JsonWebTokenError') {
      throw new GraphQLError('Invalid token', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    } else {
      throw new GraphQLError('Token validation failed', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
  }
}

module.exports = { authMiddleware, validateJWT };
