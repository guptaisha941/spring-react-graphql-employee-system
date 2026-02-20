# Docker Compose Setup Guide

Complete guide for running the Employee Management System with Docker Compose.

## 🚀 Quick Start

1. **Clone the repository and navigate to project root:**
   ```bash
   cd employee-management-graphql
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your configuration:**
   ```bash
   # Minimum required changes:
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your-secure-random-secret-key-at-least-32-characters-long
   ```

4. **Start all services:**
   ```bash
   docker-compose up -d
   ```

5. **Check service status:**
   ```bash
   docker-compose ps
   ```

6. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f employee-service
   docker-compose logs -f frontend
   docker-compose logs -f postgres
   ```

## 📋 Services

The docker-compose.yml includes:

1. **PostgreSQL** - Database server (port 5432)
2. **Spring Boot Backend** - REST API (port 8080)
3. **React Frontend** - Production build with Nginx (port 3000)

## 🔧 Configuration

### Environment Variables

All configuration is done via the `.env` file. Key variables:

#### Database
- `DB_NAME` - Database name (default: `employee_db`)
- `DB_USERNAME` - Database user (default: `postgres`)
- `DB_PASSWORD` - Database password (**CHANGE IN PRODUCTION**)
- `DB_PORT` - External database port (default: `5432`)

#### Spring Boot Backend
- `SPRING_PROFILES_ACTIVE` - Spring profile (default: `prod`)
- `EMPLOYEE_SERVICE_PORT` - Backend port (default: `8080`)
- `JWT_SECRET` - JWT signing secret (**REQUIRED - Change in production!**)
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (default: `http://localhost:3000`)

#### Frontend
- `FRONTEND_PORT` - Frontend port (default: `3000`)
- `VITE_API_URL` - Backend API URL for frontend (default: `http://localhost:8080/api`)

### Important Notes

1. **JWT Secret**: Must be at least 32 characters long. Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```

2. **CORS Configuration**: Update `CORS_ALLOWED_ORIGINS` to match your frontend URL:
   - Local: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. **Frontend API URL**: The `VITE_API_URL` is used at build time. For Docker:
   - External access: `http://localhost:8080/api`
   - Internal Docker network: `http://employee-service:8080/api` (not recommended for browser)

## 🐳 Docker Commands

### Start Services
```bash
# Start in detached mode
docker-compose up -d

# Start with logs
docker-compose up
```

### Stop Services
```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ deletes database data)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build employee-service
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f employee-service
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 employee-service
```

### Execute Commands
```bash
# Access Spring Boot container shell
docker-compose exec employee-service sh

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d employee_db

# Run database migrations (if needed)
docker-compose exec employee-service java -jar app.jar --spring.jpa.hibernate.ddl-auto=update
```

## 🏥 Health Checks

All services include health checks:

- **PostgreSQL**: `pg_isready` check
- **Spring Boot**: `/api/actuator/health` endpoint
- **Frontend**: `/health` endpoint

Check health status:
```bash
docker-compose ps
```

## 🌐 Accessing Services

After starting, access services at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Backend Health**: http://localhost:8080/api/actuator/health
- **PostgreSQL**: localhost:5432

### Default Credentials

After first startup, default users are created:

- **Admin**: `admin` / `password123`
- **Employee**: `employee1` / `password123`

⚠️ **Change these passwords in production!**

## 🔒 Production Deployment

### Security Checklist

- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Change `JWT_SECRET` to a secure random string (32+ chars)
- [ ] Update `CORS_ALLOWED_ORIGINS` to your production domain
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Use Docker secrets for sensitive values
- [ ] Configure firewall rules
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set resource limits

### Production Environment Variables

```bash
# .env.production
SPRING_PROFILES_ACTIVE=prod
DB_PASSWORD=<strong-password>
JWT_SECRET=<secure-random-32-char-string>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api
```

### Resource Limits

Add to `docker-compose.yml` for production:

```yaml
services:
  employee-service:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 🐛 Troubleshooting

### Services Won't Start

1. **Check ports are available:**
   ```bash
   # Check if ports are in use
   netstat -an | grep 8080
   netstat -an | grep 3000
   netstat -an | grep 5432
   ```

2. **Check environment variables:**
   ```bash
   docker-compose config
   ```

3. **Check logs:**
   ```bash
   docker-compose logs
   ```

### Database Connection Issues

1. **Verify PostgreSQL is healthy:**
   ```bash
   docker-compose ps postgres
   ```

2. **Check database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Test connection:**
   ```bash
   docker-compose exec postgres psql -U postgres -d employee_db
   ```

### Frontend Can't Connect to Backend

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

2. **Check CORS configuration:**
   - Ensure `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

3. **Rebuild frontend with correct API URL:**
   ```bash
   docker-compose build frontend
   docker-compose up -d frontend
   ```

### Build Failures

1. **Clear Docker cache:**
   ```bash
   docker-compose build --no-cache
   ```

2. **Check Dockerfile syntax:**
   ```bash
   docker-compose config
   ```

## 📊 Monitoring

### View Resource Usage
```bash
docker stats
```

### View Service Status
```bash
docker-compose ps
```

### Check Health Endpoints
```bash
# Backend health
curl http://localhost:8080/api/actuator/health

# Frontend health
curl http://localhost:3000/health
```

## 🔄 Updates and Maintenance

### Update Services
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Database Backups
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres employee_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres employee_db < backup.sql
```

### Clean Up
```bash
# Remove unused images
docker image prune

# Remove unused volumes (⚠️ careful!)
docker volume prune

# Full cleanup (⚠️ removes everything)
docker system prune -a --volumes
```

## 📝 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Nginx Configuration](https://nginx.org/en/docs/)

## 🆘 Support

For issues or questions:
1. Check service logs: `docker-compose logs`
2. Verify environment variables: `docker-compose config`
3. Check health endpoints
4. Review troubleshooting section above
