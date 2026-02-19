# Docker Setup Guide

This guide explains how to run the Employee Management System using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file with your production values:**
   - Change `JWT_SECRET` to a secure random string (minimum 32 characters)
   - Update database credentials if needed
   - Adjust ports if they conflict with existing services

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Check service status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f employee-service
   docker-compose logs -f graphql-gateway
   docker-compose logs -f frontend
   ```

## Service Ports

- **Frontend**: http://localhost:3000
- **GraphQL Gateway**: http://localhost:4000/graphql
- **Employee Service API**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432 (only accessible from containers)

## Production Deployment

For production, use the production override file:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

This configuration:
- Removes external port mappings for internal services
- Adds resource limits
- Configures log rotation
- Uses production-ready settings

## Building Images

To rebuild images:

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build employee-service

# Rebuild without cache
docker-compose build --no-cache
```

## Database Management

### Access PostgreSQL

```bash
docker-compose exec postgres psql -U postgres -d employee_db
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres employee_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres employee_db < backup.sql
```

## Health Checks

All services include health checks. Check status:

```bash
docker-compose ps
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Troubleshooting

### Service won't start

1. Check logs: `docker-compose logs <service-name>`
2. Verify environment variables in `.env`
3. Check port conflicts: `netstat -an | grep <port>`
4. Ensure Docker has enough resources allocated

### Database connection issues

1. Verify PostgreSQL is healthy: `docker-compose ps postgres`
2. Check database credentials in `.env`
3. Ensure `employee-service` waits for PostgreSQL (healthcheck)

### Frontend can't connect to API

1. Verify `VITE_API_URL` in `.env` matches GraphQL gateway URL
2. Check GraphQL gateway is running: `docker-compose ps graphql-gateway`
3. Rebuild frontend: `docker-compose build frontend`

## Development Mode

For development with hot-reload, you may want to run services individually:

```bash
# Start only database
docker-compose up -d postgres

# Run Spring Boot locally (with IDE)
# Run GraphQL gateway locally: npm run dev
# Run Frontend locally: npm run dev
```

## Security Notes

- **Never commit `.env` file** - it contains secrets
- Change default passwords in production
- Use strong JWT secrets (minimum 32 characters)
- Consider using Docker secrets for production
- Review and adjust security headers in `nginx.conf`
