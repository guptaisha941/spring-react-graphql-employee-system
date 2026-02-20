# Multi-stage build for Node.js GraphQL Gateway
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies and application from build stage
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app .

# Create log directory
RUN mkdir -p /var/log/graphql-gateway && \
    chown nodejs:nodejs /var/log/graphql-gateway

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Health check using /health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
