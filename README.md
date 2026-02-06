# CampusConnect Backend API

Production-ready Node.js/Express backend for CampusConnect platform

## Tech Stack
- **Runtime:** Node.js 18.x
- **Framework:** Express 5
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 6
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Authentication:** JWT + bcrypt

## Project Structure
```
src/middleware      # Express middleware (auth, validation, security)
src/modules         # Feature modules
src/modules/auth    # Authentication & user management
src/modules/event   # Events system
types/              # Typescript type definitions
utils/              # Shared utitlies
```

## Dockersetup
# Install Docker
docker compose up --build

# Run Tests
npm test

# Run development server
npm run dev

# Build for production
npm run build

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Type check without building
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Environment Variables
Look at .env.example

## Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Current coverage: 37 tests passing

## Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier configured
- 0 TypeScript errors
- All tests passing
- Zod validation on all endpoints

## API Documentation

### Authentication Endpoints

- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/me` - Get current user (requires auth)
- `GET /api/v1/users/verify` - Verify email
- `POST /api/v1/users/resend-verification` - Resend verification email
- `PUT /api/v1/users/upsert-profile` - Update user profile (requires auth)
- `POST /api/v1/users/request-password-reset` - Request password reset
- `POST /api/v1/users/reset-password` - Reset password with token

### Event Endpoints

- `POST /api/v1/events` - Create event (requires auth)

## Module Structure

Each feature module follows this pattern:

- `*.controller.ts` - HTTP request handlers
- `*.service.ts` - Business logic
- `*.routes.ts` - Route definitions
- `*.validation.ts` - Zod validation schemas
- `*.types.ts` - TypeScript interfaces
- `__tests__/*.test.ts` - Unit/integration tests

## Development Guidelines

1. All new features go in `src/modules/{feature}/`
2. Follow existing naming conventions
3. Add tests for all new endpoints
4. Use Zod for validation
5. Add proper TypeScript types
6. Follow async/await patterns
7. Use middleware for cross-cutting concerns

## Contributing

1. Create feature branch from `develop`
2. Follow existing code structure
3. Add tests
4. Ensure all tests pass
5. Submit pull request

## Team

- Ivan Juarez - DevOps/Full-Stack Lead
- Write your names here :D

## License