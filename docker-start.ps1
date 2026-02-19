# Docker Compose Quick Start Script for Windows PowerShell
# This script helps you start the Employee Management System with Docker

Write-Host "🚀 Employee Management System - Docker Setup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update .env file with your production values before starting!" -ForegroundColor Yellow
    Write-Host "   Especially change JWT_SECRET to a secure random string (min 32 chars)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue after updating .env, or Ctrl+C to exit"
}

# Check Docker
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Determine docker-compose command
try {
    docker compose version | Out-Null
    $DOCKER_COMPOSE = "docker compose"
} catch {
    try {
        docker-compose --version | Out-Null
        $DOCKER_COMPOSE = "docker-compose"
    } catch {
        Write-Host "❌ Docker Compose is not installed. Please install Docker Desktop first." -ForegroundColor Red
        exit 1
    }
}

Write-Host "🐳 Building Docker images..." -ForegroundColor Green
& $DOCKER_COMPOSE.Split(' ') build

Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Green
& $DOCKER_COMPOSE.Split(' ') up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:        http://localhost:3000"
Write-Host "   GraphQL Gateway: http://localhost:4000/graphql"
Write-Host "   Employee API:    http://localhost:8080/api"
Write-Host ""
Write-Host "📊 Check service status:" -ForegroundColor Cyan
Write-Host "   $DOCKER_COMPOSE ps"
Write-Host ""
Write-Host "📋 View logs:" -ForegroundColor Cyan
Write-Host "   $DOCKER_COMPOSE logs -f"
Write-Host ""
Write-Host "🛑 Stop services:" -ForegroundColor Cyan
Write-Host "   $DOCKER_COMPOSE down"
Write-Host ""
