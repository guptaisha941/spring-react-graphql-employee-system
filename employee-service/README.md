# Employee Management Service

Production-ready Spring Boot REST API for employee management with JWT authentication, role-based access control, and PostgreSQL database.

## 🚀 Tech Stack

- **Java 11**
- **Spring Boot 2.7.0**
- **PostgreSQL** (Database)
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Data Access)
- **HikariCP** (Connection Pooling)
- **Maven** (Build Tool)

## 📋 Prerequisites

- Java 11 or higher
- Maven 3.6+
- PostgreSQL 12+
- (Optional) Docker & Docker Compose

## 🔧 Configuration

### Environment Variables

All sensitive configuration is managed via environment variables. Copy `.env.example` to `.env` and configure:

```bash
# Database (REQUIRED)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# JWT Secret (REQUIRED in production - MUST be at least 32 characters)
JWT_SECRET=your-256-bit-secret-key-change-in-production-must-be-at-least-32-chars

# CORS (REQUIRED in production)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Profile
SPRING_PROFILES_ACTIVE=dev
```

See `.env.example` for all available configuration options.

## 🏃 Running the Application

### Development Mode

1. **Set up PostgreSQL:**
   ```sql
   CREATE DATABASE employee_db;
   ```

2. **Configure environment variables** (or use defaults in `application-dev.yml`):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=employee_db
   export DB_USERNAME=postgres
   export DB_PASSWORD=postgres
   ```

3. **Run with Maven:**
   ```bash
   mvn spring-boot:run
   ```
   Or set profile explicitly:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

4. **The application will:**
   - Start on `http://localhost:8080`
   - API available at `http://localhost:8080/api`
   - Use `dev` profile (DEBUG logging, auto-create tables)
   - Create default admin user (`admin` / `password123`)

### Production Mode

1. **Set all required environment variables:**
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export DB_HOST=your-db-host
   export DB_PORT=5432
   export DB_NAME=employee_db
   export DB_USERNAME=your-db-user
   export DB_PASSWORD=your-secure-password
   export JWT_SECRET=your-256-bit-secret-key-min-32-chars
   export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

2. **Build the JAR:**
   ```bash
   mvn clean package -DskipTests
   ```

3. **Run the JAR:**
   ```bash
   java -jar target/employee-service-1.0.0-SNAPSHOT.jar
   ```

   Or with explicit profile:
   ```bash
   java -jar -Dspring.profiles.active=prod target/employee-service-1.0.0-SNAPSHOT.jar
   ```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t employee-service:latest .
```

### Run with Docker

```bash
docker run -d \
  --name employee-service \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=employee_db \
  -e DB_USERNAME=your-db-user \
  -e DB_PASSWORD=your-secure-password \
  -e JWT_SECRET=your-256-bit-secret-key-min-32-chars \
  -e CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com \
  employee-service:latest
```

### Docker Compose

See root `docker-compose.yml` for full stack deployment.

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login (returns JWT token)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/refresh` - Refresh access token

### Employees (Protected - Requires JWT)
- `GET /api/employees` - List employees (paginated)
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee (ADMIN only)
- `PUT /api/employees/{id}` - Update employee (ADMIN only)
- `DELETE /api/employees/{id}` - Delete employee (ADMIN only)

### Health Check
- `GET /api/actuator/health` - Application health status

## 🔐 Default Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `password123`
- **Role:** `ROLE_ADMIN`
- **Permissions:** Full CRUD access

### Employee Accounts
- **Username:** `employee1`, `employee2`, etc.
- **Password:** `password123`
- **Role:** `ROLE_EMPLOYEE`
- **Permissions:** Read-only access

> ⚠️ **Security Warning:** Change default passwords immediately in production!

## 📝 Profiles

### Development (`dev`)
- DEBUG logging enabled
- SQL queries logged
- Auto-create/update database schema (`ddl-auto: update`)
- H2 console disabled
- Detailed error messages

### Production (`prod`)
- INFO logging only
- No SQL logging
- Validate database schema (`ddl-auto: validate`)
- H2 console disabled
- Generic error messages (hide sensitive details)
- Optimized connection pool settings

## 🔒 Security Features

- **JWT Authentication:** Stateless token-based auth
- **Role-Based Access Control:** Admin vs Employee roles
- **Password Encryption:** BCrypt with strength 12
- **CORS Configuration:** Configurable allowed origins
- **Error Handling:** Standardized error responses
- **Input Validation:** Bean validation on all endpoints

## 📁 Project Structure

```
employee-service/
├── src/
│   ├── main/
│   │   ├── java/com/company/employee/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── service/          # Business logic
│   │   │   ├── repository/       # Data access
│   │   │   ├── model/            # Entity models
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── security/         # Security configuration
│   │   │   └── exception/        # Exception handlers
│   │   └── resources/
│   │       ├── application.yml           # Base configuration
│   │       ├── application-dev.yml       # Development profile
│   │       └── application-prod.yml      # Production profile
│   └── test/                     # Unit tests
├── Dockerfile                    # Production Docker image
├── .env.example                  # Environment variables template
├── .gitignore                   # Git ignore rules
└── pom.xml                      # Maven dependencies
```

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📈 Monitoring

- **Health Check:** `GET /api/actuator/health`
- **Application Info:** `GET /api/actuator/info`
- **Logs:** Check `logs/employee-service-dev.log` (dev) or `/var/log/employee-service/application.log` (prod)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in environment variables
- Ensure database exists: `CREATE DATABASE employee_db;`

### Port Already in Use
- Change `SERVER_PORT` environment variable
- Or kill process using port 8080

### JWT Token Issues
- Ensure `JWT_SECRET` is set (minimum 32 characters)
- Check token expiration settings
- Verify token is sent in `Authorization: Bearer <token>` header

## 📄 License

This project is proprietary software.

## 👥 Support

For issues or questions, contact the development team.
