# Docker Setup for Better OpenLMS

This guide explains how to run Better OpenLMS using Docker and Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- Copy `.env.example` to `.env` and configure your environment variables

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment:**
   Edit `.env` file with your specific configuration:
   - Database credentials
   - JWT secret (change this in production!)
   - Email settings
   - S3/storage settings

3. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```
   > **Note:** Database migrations will run automatically when the API service starts.

4. **Check service status:**
   ```bash
   docker-compose ps
   ```

## Services

The Docker Compose setup includes the following services:

- **admin** - Admin dashboard (http://localhost:4000)
- **platform** - Main platform (http://localhost:3000)
- **api** - Backend API (http://localhost:3001)
- **worker** - Background job processor
- **postgres** - PostgreSQL database
- **redis** - Redis for caching and job queue

## Development vs Production

### Development Mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production Mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Useful Commands

### View logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs worker
docker-compose logs postgres
```

### Rebuild specific service
```bash
docker-compose up --build api
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ This will delete all data)
```bash
docker-compose down -v
```

### Access database
```bash
docker-compose exec postgres psql -U ${DATABASE_USER:-betterlms} -d ${DATABASE_NAME:-betterlms}
```

### Access Redis
```bash
docker-compose exec redis redis-cli
```

## Database Management

The Docker setup includes automatic database management:

### Automatic Migrations
- Database migrations run automatically when the API service starts
- No manual intervention required for initial setup

### Manual Database Operations
If you need to perform manual database operations:

```bash
# Access PostgreSQL directly
make db
# or
docker-compose exec postgres psql -U ${DATABASE_USER:-betterlms} -d ${DATABASE_NAME:-betterlms}

# Reset database (⚠️ This will delete all data)
docker-compose exec api pnpm --filter @betterlms/database db:reset

# Open Prisma Studio (database GUI)
docker-compose exec api pnpm --filter @betterlms/database db:studio

# Run database seeds
docker-compose exec api pnpm seed:events
docker-compose exec api pnpm seed:users
docker-compose exec api pnpm seed:content
docker-compose exec api pnpm seed:all
```

### Database Backup/Restore
```bash
# Backup database
docker-compose exec postgres pg_dump -U ${DATABASE_USER:-betterlms} ${DATABASE_NAME:-betterlms} > backup.sql

# Restore database
docker-compose exec -T postgres psql -U ${DATABASE_USER:-betterlms} -d ${DATABASE_NAME:-betterlms} < backup.sql
```

## Environment Variables

Key environment variables to configure in your `.env` file:

```bash
# Database
DATABASE_NAME=betterlms
DATABASE_USER=betterlms
DATABASE_PASSWORD=your-secure-password

# API
API_PORT=3001
JWT_SECRET=your-super-secret-jwt-key

# Frontend URLs
VITE_PLATFORM_URL=http://localhost:3000
VITE_ADMIN_URL=http://localhost:4000
VITE_API_URL=http://localhost:3001

# Email (optional)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-api-key
```

## Health Checks

All services include health checks:
- API: HTTP endpoint at `/health`
- Postgres: `pg_isready` command
- Redis: `redis-cli ping`
- Worker: Simple process check

## Volumes

Persistent data is stored in Docker volumes:
- `postgres_data`: PostgreSQL data
- `redis_data`: Redis data

## Troubleshooting

### Port conflicts
If you have port conflicts, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "4001:4000"  # Change admin to port 4001
```

### Build issues
If you encounter build issues, try:
```bash
# Clean build
docker-compose down --rmi all

# Rebuild without cache
docker-compose build --no-cache
```

### Database connection issues
1. Ensure PostgreSQL is healthy: `docker-compose ps`
2. Check database logs: `docker-compose logs postgres`
3. Verify environment variables in `.env`

### Worker not processing jobs
1. Check Redis connection: `docker-compose logs worker`
2. Verify Redis is healthy: `docker-compose ps redis`
3. Check API logs for any queue-related errors

## Architecture

```
┌─────────────┐    ┌─────────────┐
│   Admin     │    │  Platform   │
│  (Port 4000)│    │  (Port 3000)│
└─────────────┘    └─────────────┘
       │                   │
       └─────────┬─────────┘
                 │
        ┌─────────────┐
        │     API     │
        │  (Port 8000)│
        │  (Internal) │
        └─────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌─────────┐ ┌─────────┐ ┌─────────┐
│Postgres │ │  Redis  │ │ Worker  │
│(Internal)│ │(Internal)│ │(Internal)│
└─────────┘ └─────────┘ └─────────┘
```

## Security Notes

- Change the `JWT_SECRET` in production
- Use strong database passwords
- Enable SSL in production
- Restrict database access to the API container only
- Regularly update base images
