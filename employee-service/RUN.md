# How to Run

## 1. PostgreSQL

The app uses PostgreSQL (default in `dev` profile).

- **Host:** localhost  
- **Port:** 5432  
- **Database:** `employee_db`  
- **User:** `postgres`  
- **Password:** `postgres`

Create the database if it doesn't exist:

```sql
CREATE DATABASE employee_db;
```

(Or use your own DB and set env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.)

## 2. Start the application

From the project root (`employee-service`):

```bash
mvn spring-boot:run
```

Or run the main class `com.company.employee.EmployeeServiceApplication` from your IDE.

Default profile is `dev`, so the app will:

- Connect to `jdbc:postgresql://localhost:5432/employee_db`
- Create/update tables (`ddl-auto: update`)
- Load 1 admin + 5 employee users (see logs for "Created admin user", etc.)

## 3. Check it's running

- **Health:** `http://localhost:8080/api/actuator/health`
- **Login:** POST `http://localhost:8080/api/v1/auth/login` with body:
  ```json
  { "usernameOrEmail": "admin", "password": "password123" }
  ```

Then test the rest in Postman as described earlier.
