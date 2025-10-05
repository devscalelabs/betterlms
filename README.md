# BetterLMS

> A modern Social Media + Learning Management System built to help creators build private communities

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![Elysia](https://img.shields.io/badge/Elysia-1.4-green.svg)](https://elysiajs.com/)

## 🚀 Overview

BetterLMS is a comprehensive platform that combines social media features with learning management capabilities. It's designed to help content creators, educators, and community leaders build engaging private communities where they can share knowledge, interact with members, and deliver educational content.

### Key Features

- **📱 Social Media Features**
  - Timeline-based content feed
  - Post creation with rich text editor
  - Like and comment system
  - User profiles and following system
  - Media upload and sharing

- **📚 Learning Management**
  - Article creation and management
  - Course organization
  - Channel-based content grouping
  - Private and public communities

- **👥 Community Management**
  - User roles (Admin, Mentor, User)
  - Channel membership system
  - Content moderation tools
  - Analytics dashboard

- **🔧 Admin Features**
  - Comprehensive dashboard
  - User management
  - Content oversight
  - Platform statistics

## 🏗️ Architecture

BetterLMS is built as a modern monorepo using a microservices architecture:

```
better-openlms/
├── apps/
│   ├── admin/          # Admin dashboard (React + Vite)
│   ├── api/            # Backend API (Elysia + TypeScript)
│   └── platform/       # Main platform (React + Vite)
├── packages/
│   ├── common/         # Shared utilities
│   ├── database/       # Prisma ORM + PostgreSQL
│   ├── email/          # Email service (Nodemailer)
│   ├── storages/       # S3 file storage
│   └── ui/             # Shared UI components
└── tooling/            # Development scripts and tools
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **React Router** - Client-side routing

### Backend
- **Elysia** - Fast, lightweight web framework
- **TypeScript** - Type-safe server development
- **Prisma** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Infrastructure
- **AWS S3** - File storage and media hosting
- **SMTP** - Email delivery service
- **pnpm** - Fast, efficient package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database
- AWS S3 bucket (for file storage)
- SMTP email service

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/better-openlms.git
   cd better-openlms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/betterlms"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   
   # AWS S3
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="your-region"
   AWS_S3_BUCKET="your-bucket-name"
   
   # Email
   SMTP_HOST="your-smtp-host"
   SMTP_PORT="587"
   SMTP_USER="your-email"
   SMTP_PASS="your-password"
   
   # Ports
   BACKEND_PORT="8000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Seed initial data (optional)
   pnpm seed:all
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   pnpm api:dev      # Backend API (port 8000)
   pnpm platform:dev # Main platform
   pnpm admin:dev    # Admin dashboard
   ```

## 📁 Project Structure

### Apps

- **`apps/admin/`** - Administrative dashboard for platform management
- **`apps/api/`** - RESTful API server with authentication and business logic
- **`apps/platform/`** - Main user-facing application

### Packages

- **`packages/database/`** - Database schema, migrations, and Prisma client
- **`packages/ui/`** - Reusable UI components and design system
- **`packages/common/`** - Shared utilities and helper functions
- **`packages/email/`** - Email service integration
- **`packages/storages/`** - File upload and storage management

### Key Features Implementation

#### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Mentor, User)
- Protected routes and API endpoints

#### Content Management
- Rich text editor with TipTap
- Media upload to S3
- Article and post creation
- Channel-based organization

#### Social Features
- User profiles and following system
- Like and comment functionality
- Timeline feed
- Mention system

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start all services
pnpm api:dev            # Start API server only
pnpm platform:dev       # Start platform only

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:migrate         # Run database migrations
pnpm db:reset           # Reset database
pnpm db:studio          # Open Prisma Studio

# Seeding
pnpm seed:users         # Seed user data
pnpm seed:content       # Seed content data
pnpm seed:all           # Seed all data

# Utilities
pnpm createsuperuser    # Create admin user
pnpm test:email         # Test email configuration
pnpm reset:db           # Reset and seed database

# Code Quality
pnpm format             # Format code with Biome
pnpm lint               # Lint code
pnpm lint:fix           # Fix linting issues
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for code formatting and linting:

- **Indentation**: Tabs
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Import organization**: Automatic

## 🔒 Security

- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- CORS configuration for API security
- Input validation with Zod schemas
- SQL injection prevention with Prisma ORM

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts with roles and profiles
- **Posts** - Social media posts with threading support
- **Channels** - Community groups (public/private)
- **Articles** - Educational content
- **Media** - File attachments and images
- **Likes** - Post engagement tracking
- **Follows** - User relationship system

## 🚀 Deployment

### Production Build

```bash
# Build all applications
pnpm --filter api build
pnpm --filter platform build
pnpm --filter admin build
```

### Environment Variables

Ensure all required environment variables are configured for production:

- Database connection string
- JWT secret key
- AWS S3 credentials
- SMTP email configuration
- CORS origins for production domains

## 🤝 Contributing

**Note**: This project is currently not accepting external contributors. The codebase is provided for reference and educational purposes.

If you're interested in the project or have questions, please feel free to:

- Open issues for bug reports or feature requests
- Fork the repository for your own use
- Study the codebase for learning purposes

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for better community-driven learning platforms
- Thanks to all the open-source projects that made this possible

---

**BetterLMS** - Empowering creators to build meaningful communities through technology.
