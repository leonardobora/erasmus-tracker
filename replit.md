# Erasmus Mundus Tracker

## Overview

A web application for tracking Erasmus Mundus Joint Master scholarship programs across Europe. The platform helps students discover, filter, and monitor 100+ master's programs with real-time deadline tracking, smart filtering by field and country, and scholarship information. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with HMR support
- **Design System**: Material Design 3 principles with academic refinements as documented in `design_guidelines.md`

Key frontend patterns:
- Component-based architecture with reusable UI components in `client/src/components/ui/`
- Custom hooks for data fetching in `client/src/hooks/`
- Page-based routing structure in `client/src/pages/`
- Path aliases configured: `@/` for client source, `@shared/` for shared types

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful JSON API under `/api/` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration

Key backend patterns:
- Shared schema definitions between frontend and backend in `shared/schema.ts`
- In-memory storage with database schema ready for PostgreSQL migration
- Seed data for sample programs built into storage layer
- Development mode uses Vite middleware for HMR

### Data Model
Core entities defined in `shared/schema.ts`:
- **Users**: Basic auth structure with id, username, password
- **Programs**: Scholarship programs with fields for name, URL, consortium, countries (array), field of study, deadline, duration, tuition status, monthly allowance, and English requirements

Program fields are enumerated: AI/ML, Data Science, Engineering, Sustainability, Business, Health, Social Sciences, Arts & Humanities

### API Endpoints
- `GET /api/programs` - List programs with optional filters (field, country, sortBy)
- `GET /api/programs/:id` - Get single program details
- `GET /api/deadlines/upcoming` - Get programs with approaching deadlines
- `GET /api/stats` - Get aggregate statistics

### Build System
- Development: `npm run dev` runs tsx for server with Vite middleware
- Production: Custom build script compiles server with esbuild, frontend with Vite
- Output: Server bundle to `dist/index.cjs`, client assets to `dist/public/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations stored in `./migrations` directory
- Push schema with `npm run db:push`

### UI Component Library
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Underlying headless component primitives
- **Lucide React**: Icon library

### Third-Party Services
- No external API integrations currently active
- Architecture documents reference future plans for:
  - SendGrid for email notifications
  - Telegram Bot API for alerts
  - Web scraping from EC Portal and program websites

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` + `drizzle-zod`: Type-safe database operations
- `express` + `express-session`: HTTP server and sessions
- `connect-pg-simple`: PostgreSQL session storage
- `date-fns`: Date manipulation utilities
- `wouter`: Client-side routing
- `class-variance-authority` + `clsx` + `tailwind-merge`: Styling utilities