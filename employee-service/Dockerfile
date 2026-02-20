# Multi-stage build for Spring Boot application
# Build stage
FROM maven:3.9-eclipse-temurin-11 AS build

WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests in production build)
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:11-jre-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Create log directory
RUN mkdir -p /var/log/employee-service && chown spring:spring /var/log/employee-service

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1

# Run the application with production profile
# Environment variables should be set via docker-compose or Kubernetes
# Profile can be overridden via SPRING_PROFILES_ACTIVE env var
ENTRYPOINT ["sh", "-c", "java -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -jar app.jar"]
