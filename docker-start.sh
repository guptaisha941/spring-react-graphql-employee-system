#!/bin/bash

# Docker Compose Quick Start Script
# This script helps you start the Employee Management System with Docker

set -e

echo "🚀 Employee Management System - Docker Setup"
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your production values before starting!"
    echo "   Especially change JWT_SECRET to a secure random string (min 32 chars)"
    echo ""
    read -p "Press Enter to continue after updating .env, or Ctrl+C to exit..."
fi

# Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Determine docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "🐳 Building Docker images..."
$DOCKER_COMPOSE build

echo ""
echo "🚀 Starting services..."
$DOCKER_COMPOSE up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ Services started!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:        http://localhost:3000"
echo "   GraphQL Gateway: http://localhost:4000/graphql"
echo "   Employee API:    http://localhost:8080/api"
echo ""
echo "📊 Check service status:"
echo "   $DOCKER_COMPOSE ps"
echo ""
echo "📋 View logs:"
echo "   $DOCKER_COMPOSE logs -f"
echo ""
echo "🛑 Stop services:"
echo "   $DOCKER_COMPOSE down"
echo ""
