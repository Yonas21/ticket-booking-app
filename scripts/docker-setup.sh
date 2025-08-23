#!/bin/bash

# BusTicket Docker Setup Script
# This script helps set up the Docker environment for the BusTicket application

set -e

echo "🚌 BusTicket Docker Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Docker daemon is running
check_docker_daemon() {
    print_status "Checking Docker daemon..."
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Create environment file if it doesn't exist
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please update the .env file with your actual values before starting services"
            print_status "You can edit the .env file with: nano .env"
        else
            print_status "Creating basic .env file..."
            cat > .env << EOF
# BusTicket Environment Variables
NODE_ENV=development
VITE_API_URL=http://localhost:8080

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=busticket
DB_SSLMODE=disable

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Authorization,Content-Type,X-Requested-With

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Server
PORT=8080
HOST=0.0.0.0
ENVIRONMENT=development
LOG_LEVEL=info

# Security
BCRYPT_COST=12
SESSION_SECRET=your-session-secret-key
EOF
            print_warning "Please update the .env file with your actual values before starting services"
            print_status "You can edit the .env file with: nano .env"
        fi
        print_success "Created .env file"
    else
        print_warning ".env file already exists"
    fi
}

# Validate environment file
validate_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found. Please run the setup script first."
        exit 1
    fi
    
    # Check for required variables
    local required_vars=("DB_PASSWORD" "JWT_SECRET" "SESSION_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env || grep -q "^${var}=your-" .env; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_warning "The following required environment variables need to be set:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_status "Please update your .env file with actual values"
        print_status "You can edit the .env file with: nano .env"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Build and start services
start_services() {
    local profile=${1:-development}
    
    print_status "Starting services with profile: $profile"
    
    if [ "$profile" = "production" ]; then
        docker-compose --profile production up -d
    else
        docker-compose --profile development up -d
    fi
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    timeout=60
    while ! docker-compose exec -T postgres pg_isready -U postgres -d busticket &> /dev/null; do
        if [ $timeout -le 0 ]; then
            print_error "PostgreSQL failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "PostgreSQL is ready"
    
    # Wait for backend
    print_status "Waiting for backend..."
    timeout=60
    while ! curl -f http://localhost:8080/health &> /dev/null; do
        if [ $timeout -le 0 ]; then
            print_error "Backend failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Backend is ready"
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout=60
    while ! curl -f http://localhost:3000 &> /dev/null; do
        if [ $timeout -le 0 ]; then
            print_error "Frontend failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Frontend is ready"
}

# Show service status
show_status() {
    print_status "Service Status:"
    echo ""
    docker-compose ps
    echo ""
    print_status "Service URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8080"
    echo "PostgreSQL: localhost:5432"
    echo "Redis: localhost:6379"
}

# Main function
main() {
    local profile=${1:-development}
    
    echo ""
    print_status "Starting BusTicket Docker setup..."
    echo ""
    
    check_docker
    check_docker_daemon
    create_env_file
    validate_env_file
    start_services "$profile"
    wait_for_services
    show_status
    
    echo ""
    print_success "🎉 BusTicket is now running!"
    echo ""
    print_status "You can access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080"
    echo ""
    print_status "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Rebuild: docker-compose up --build"
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    "production")
        main "production"
        ;;
    "development"|"")
        main "development"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [development|production]"
        echo ""
        echo "Options:"
        echo "  development  Start in development mode (default)"
        echo "  production   Start in production mode"
        echo "  help         Show this help message"
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
