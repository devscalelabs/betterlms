.PHONY: help build up down logs clean ps shell-api shell-db shell-redis db db-reset db-studio seed-events seed-users seed-content seed-all

# Default target
help:
	@echo "Available commands:"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services in detached mode"
	@echo "  make down       - Stop and remove all containers"
	@echo "  make logs       - Show logs for all services"
	@echo "  make logs-api   - Show logs for API service"
	@echo "  make logs-worker- Show logs for worker service"
	@echo "  make ps         - Show status of all services"
	@echo "  make clean      - Remove all containers, images, and volumes"
	@echo "  make shell-api  - Open shell in API container"
	@echo "  make shell-db   - Open PostgreSQL shell"
	@echo "  make shell-redis- Open Redis CLI"
	@echo "  make rebuild    - Rebuild and restart all services"
	@echo ""
	@echo "Database commands:"
	@echo "  make db         - Access PostgreSQL database"
	@echo "  make db-reset   - Reset database (⚠️ deletes all data)"
	@echo "  make db-studio  - Open Prisma Studio (database GUI)"
	@echo "  make seed-events- Seed events data"
	@echo "  make seed-users - Seed users data"
	@echo "  make seed-content- Seed content data"
	@echo "  make seed-all   - Seed all data"

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Show API logs
logs-api:
	docker-compose logs -f api

# Show worker logs
logs-worker:
	docker-compose logs -f worker

# Show status
ps:
	docker-compose ps

# Clean everything (DANGEROUS - removes all data)
clean:
	docker-compose down -v --rmi all

# Open shell in API container
shell-api:
	docker-compose exec api sh

# Open PostgreSQL shell
shell-db:
	docker-compose exec postgres psql -U $${DATABASE_USER:-betterlms} -d $${DATABASE_NAME:-betterlms}

# Open Redis CLI
shell-redis:
	docker-compose exec redis redis-cli

# Rebuild and restart
rebuild: down build up

# Database access
db:
	docker-compose exec postgres psql -U $${DATABASE_USER:-betterlms} $${DATABASE_NAME:-betterlms}

# Database reset (DANGER - deletes all data)
db-reset:
	docker-compose exec api pnpm --filter @betterlms/database db:reset

# Open Prisma Studio
db-studio:
	docker-compose exec api pnpm --filter @betterlms/database db:studio

# Seed commands
seed-events:
	docker-compose exec api pnpm seed:events

seed-users:
	docker-compose exec api pnpm seed:users

seed-content:
	docker-compose exec api pnpm seed:content

seed-all:
	docker-compose exec api pnpm seed:all

# Quick start (copy env, build, and start)
start:
	@if [ ! -f .env ]; then \
		echo "Copying .env.example to .env"; \
		cp .env.example .env; \
		echo "Please edit .env with your configuration"; \
	fi
	docker-compose up --build -d
	@echo "Services are starting..."
	@echo "Platform: http://localhost:3000"
	@echo "Admin: http://localhost:4000"
	@echo "Check status with: make ps"
