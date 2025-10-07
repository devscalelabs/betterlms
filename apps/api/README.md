# Better OpenLMS API v2

A modern, fast, and type-safe API built with Hono framework for the Better OpenLMS platform. This API follows the exact same structure and routes as the original API but uses the Hono framework instead of Elysia.

## 🚀 Features

- **Ultra-fast**: Built on Hono, optimized for edge computing
- **Type-safe**: Full TypeScript support with Zod validation
- **1:1 API compatibility**: Same routes and responses as the original API
- **Core package integration**: Uses business logic from `@betterlms/core`
- **Modular architecture**: Organized routes and middleware
- **Authentication**: JWT-based authentication with magic link support
- **Validation**: Request/response validation using Zod schemas
- **CORS support**: Configurable cross-origin resource sharing
- **Error handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Request logging middleware
- **Health checks**: Built-in health check endpoint

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository and navigate to the API directory:
```bash
cd apps/apiv2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:8000` by default (same as original API).

## 🏗️ Build & Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm run start
# or
yarn start
```

## 📁 Project Structure

```
src/
├── index.ts          # Main Hono application
├── server.ts         # Development server setup
├── routes/           # API route definitions
│   ├── index.ts      # Routes aggregation
│   ├── auth.ts       # Authentication routes
│   └── users.ts      # User management routes
├── middleware/       # Custom middleware
│   └── auth.ts       # Authentication & authorization
└── types/            # TypeScript type definitions
```

## 🔌 API Endpoints

### Base URL
- Development: `http://localhost:8000`
- Production: `https://your-api-domain.com`

### Health Check
- `GET /health` - Check API health status

### API Routes (v1)
All routes follow the same pattern as the original API:

#### Authentication
- `POST /api/v1/auth/login` - User login (password or magic link)
- `POST /api/v1/auth/verify` - Verify magic link code

#### Account
- `GET /api/v1/account` - Get current user profile

#### Profile Management
- `GET /api/v1/profile` - Get all users
- `GET /api/v1/profile/:username` - Get user by username
- `PUT /api/v1/profile` - Update current user profile
- `POST /api/v1/profile/:username/follow` - Follow a user
- `DELETE /api/v1/profile/:username/follow` - Unfollow a user
- `POST /api/v1/profile/:username/suspend` - Suspend a user (admin only)
- `DELETE /api/v1/profile/:username/suspend` - Unsuspend a user (admin only)

#### Courses
- `GET /api/v1/courses` - Get courses with filters
- `GET /api/v1/courses/:id` - Get course by ID
- `GET /api/v1/courses/slug/:slug` - Get course by slug
- `POST /api/v1/courses` - Create new course (admin only)
- `POST /api/v1/courses/:courseId/sections` - Create course section (admin only)
- `POST /api/v1/courses/:courseId/sections/:sectionId/lessons` - Create lesson (admin only)

#### Enrollments
- `GET /api/v1/enrollments` - Get all enrollments (admin only)
- `GET /api/v1/enrollments/my-enrollments` - Get current user enrollments
- `GET /api/v1/enrollments/:id` - Get enrollment by ID
- `POST /api/v1/enrollments` - Create new enrollment
- `PUT /api/v1/enrollments/:id/status` - Update enrollment status (admin only)
- `PUT /api/v1/enrollments/:id/progress` - Update enrollment progress
- `DELETE /api/v1/enrollments/:id` - Delete enrollment

#### Lessons
- `GET /api/v1/lessons/:lessonId` - Get lesson by ID
- `PUT /api/v1/lessons/:lessonId` - Update lesson (admin only)

#### Channels
- `GET /api/v1/channels` - Get public channels
- `POST /api/v1/channels` - Create new channel
- `GET /api/v1/channels/:id` - Get channel by ID
- `POST /api/v1/channels/:id/join` - Join channel
- `DELETE /api/v1/channels/:id/leave` - Leave channel

#### Posts
- `GET /api/v1/posts` - Get posts with filters
- `GET /api/v1/posts/:id` - Get post by ID
- `POST /api/v1/posts` - Create new post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/posts/:id/like` - Like post
- `DELETE /api/v1/posts/:id/like` - Unlike post

#### Articles
- `GET /api/v1/articles` - Get articles with filters
- `GET /api/v1/articles/:id` - Get article by ID
- `POST /api/v1/articles` - Create new article
- `PUT /api/v1/articles/:id` - Update article
- `DELETE /api/v1/articles/:id` - Delete article
- `POST /api/v1/articles/:id/like` - Like article
- `DELETE /api/v1/articles/:id/like` - Unlike article

#### Media
- `POST /api/v1/media` - Upload media files

#### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all notifications as read

#### Link Preview
- `GET /api/v1/link-preview` - Get link preview data

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication with magic link support. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Methods

1. **Password Authentication**: Traditional email/password login
2. **Magic Link Authentication**: Passwordless login via email verification code

### Role-based Access Control

- `STUDENT`: Basic access to learning materials
- `INSTRUCTOR`: Can manage courses and content
- `ADMIN`: Full system access

### Magic Link Flow

1. Request magic link: `POST /api/v1/auth/login` (with email only)
2. Receive verification code via email
3. Verify code: `POST /api/v1/auth/verify` (with email and code)
4. Receive JWT token for subsequent requests

## 📝 Request/Response Examples

### Login with Password
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login with Magic Link
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Verify Magic Link
```bash
curl -X POST http://localhost:8000/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456"
  }'
```

### Get Current User Profile
```bash
curl -X GET http://localhost:8000/api/v1/account \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Courses
```bash
curl -X GET http://localhost:8000/api/v1/courses \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🧪 Testing

Run tests:
```bash
npm run test
# or
yarn test
```

Run tests in watch mode:
```bash
npm run test:watch
# or
yarn test:watch
```

Generate coverage report:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `CORS_ORIGIN`: Allowed CORS origins

### CORS Configuration

Update the CORS middleware in `src/index.ts` to configure allowed origins, methods, and headers.

## 📦 Dependencies

### Core Dependencies
- `hono`: Web framework
- `@hono/node-server`: Node.js server adapter
- `@hono/zod-validator`: Zod validation middleware
- `zod`: Schema validation
- `jose`: Modern JWT implementation (from core package)
- `bcrypt`: Password hashing (from core package)
- `@betterlms/core`: Core business logic and services
- `@betterlms/database`: Database integration
- `@betterlms/email`: Email service integration
- `@betterlms/storages`: File storage integration
- `bullmq`: Queue management (from core package)
- `ioredis`: Redis client (from core package)
- `open-graph-scraper`: Link preview functionality
- `dotenv`: Environment variable loading

### Development Dependencies
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution
- `eslint`: Code linting
- `vitest`: Testing framework
- `@betterlms/typescript`: Shared TypeScript configuration
- `@types/*`: TypeScript type definitions

## 🚀 Deployment

### Docker (Recommended)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t better-openlms-apiv2 .
docker run -p 8000:8000 better-openlms-apiv2
```

### Cloud Platforms

This Hono application can be deployed to:
- Vercel
- Netlify
- AWS Lambda
- Google Cloud Functions
- Cloudflare Workers
- Railway
- DigitalOcean App Platform

### Environment Variables

Key environment variables needed for deployment:
- `BACKEND_PORT`: Server port (default: 8000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT signing
- `FRONTEND_URL`: Frontend application URL for magic links
- Database and storage configurations from `@betterlms/*` packages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Hono Documentation](https://hono.dev/)
- [Zod Documentation](https://zod.dev/)
- [JWT Documentation](https://jwt.io/)
- [BetterLMS Core Package](../../../packages/core/)
- [Original API Reference](../../../apps/api/)

## 🔄 Migration Notes

This API v2 is designed to be a drop-in replacement for the original API:

- **Same endpoints**: All routes match the original API exactly
- **Same responses**: Response formats are identical
- **Same authentication**: JWT tokens work the same way
- **Same validation**: Request validation rules are preserved
- **Better performance**: Built on Hono for improved speed
- **Modern stack**: Uses latest TypeScript and package management

The only differences are:
- Framework: Hono instead of Elysia
- Performance: Faster response times
- Package: Uses `@betterlms/core` for business logic

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
