# BioPredict - Healthcare Prediction Platform

## Overview

BioPredict is a comprehensive web-based healthcare platform that leverages machine learning and AI to analyze biomarker data from various biological fluids (blood, saliva, urine, and cerebrospinal fluid) and predict disease risks. The platform provides early detection and personalized health recommendations based on lab test results, analyzing risks for conditions including diabetes, cardiovascular disease, oral cancer, kidney disease, Alzheimer's, and brain tumors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- Framer Motion for animations and transitions

**UI Framework:**
- Shadcn/ui components (Radix UI primitives) with Tailwind CSS
- Custom theme system with CSS variables for fluid-type-specific color schemes
- Responsive design with mobile-first approach

**Key Design Patterns:**
- Context-based authentication state management (AuthContext)
- Protected route wrapper for authenticated pages
- Lazy loading for route-based code splitting
- Form validation using React Hook Form with Zod schemas
- Reusable component library with consistent styling

**State Management Strategy:**
- Local state with React hooks for component-level data
- Context API for global auth state
- React Query for server data caching and synchronization
- LocalStorage for auth token persistence

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Prisma ORM for database operations
- PostgreSQL via Neon serverless database
- Drizzle Kit as alternative ORM (configured but Prisma is primary)

**API Design:**
- RESTful API structure with route modules
- JWT-based authentication middleware
- CORS configuration for cross-origin requests
- Structured error handling with appropriate HTTP status codes

**Route Organization:**
- `/api/auth` - Authentication endpoints (login, register, getCurrentUser)
- `/api/predictions` - Biomarker analysis endpoints (blood, saliva, urine, CSF)
- `/api/ai` - AI chatbot endpoints for health insights

**Authentication Flow:**
- Bcrypt for password hashing
- JWT tokens with configurable expiration
- Token validation middleware for protected routes
- Session persistence via localStorage on client

### Machine Learning Integration

**ML Architecture:**
- Python-based prediction models using scikit-learn
- Separate trained models for each disease prediction
- Node.js-Python bridge using child_process spawn
- Model artifacts (joblib files) for diabetes, cardiovascular, oral cancer, kidney disease, Alzheimer's, and brain tumor predictions

**Prediction Pipeline:**
1. Client submits biomarker data via TypeScript-validated forms
2. Server validates data against Zod schemas
3. Python ML service processes features through trained models
4. Risk scores and detailed analysis returned to client
5. Results stored in database with user association

**Model Training Approach:**
- Random Forest Classifier for robust multi-feature analysis
- StandardScaler for feature normalization
- Separate models per fluid type and disease
- Biomarker-specific risk assessment logic

### Data Storage Solutions

**Database Schema:**
- `users` table: id, username, email, password (hashed), createdAt
- `biomarker_records` table: id, userId, fluidType, biomarkers (jsonb), predictions (jsonb), createdAt

**ORM Configuration:**
- Prisma as primary ORM with migrations
- Drizzle configured as alternative with PostgreSQL dialect
- Schema defined in both Prisma schema and Drizzle TypeScript

**Data Persistence Strategy:**
- User credentials securely hashed with bcrypt
- Biomarker data and predictions stored as JSON for flexibility
- Temporal data tracking with timestamp fields
- Foreign key relationships for data integrity

### External Dependencies

**AI/ML Services:**
- OpenRouter API for AI chatbot functionality (GPT model integration)
- Anthropic AI SDK (@anthropic-ai/sdk) - configured for potential Claude integration
- Google Generative AI (@google/generative-ai) - available for Gemini models
- Python ML models (scikit-learn, joblib) for disease predictions

**Database:**
- Neon serverless PostgreSQL (@neondatabase/serverless)
- WebSocket support for Neon connection pooling
- DATABASE_URL environment variable for connection string

**Authentication:**
- JWT (jsonwebtoken) for token generation and verification
- Bcrypt for secure password hashing
- JWT_SECRET environment variable for token signing

**Third-Party UI/UX:**
- Radix UI component primitives for accessible UI elements
- Heroicons for iconography
- Google Fonts (Inter, Poppins) for typography
- Framer Motion for animation capabilities

**Development Tools:**
- Replit-specific plugins for cartography and theme JSON
- ESBuild for server bundling in production
- Concurrently for parallel dev server execution
- TSX for TypeScript execution without compilation

**Environment Configuration:**
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Token signing secret (generated via script)
- OPENAI_API_KEY - OpenRouter API key for AI features
- NODE_ENV - Environment mode (development/production)