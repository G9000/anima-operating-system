# Anima Operating System - AI Instructions

## Project Overview

Anima Operating System is a sophisticated AI persona generation and chat system that allows users to create, customize, and interact with detailed AI personalities called "constructs." The system combines a FastAPI backend with a Next.js frontend, using BAML (Boundary AI Markup Language) for structured AI persona generation and Ollama for local LLM integration.

## Architecture

### Backend (FastAPI)

- **Location**: `app/` directory
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: Supabase authentication system
- **AI Integration**: Ollama via LangChain, BAML for structured generation

### Frontend (Next.js)

- **Location**: `web/` directory
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and local state
- **UI Components**: Custom components in `web/app/components/`

### Key Technologies

- **BAML**: Structured AI persona generation with type safety
- **Ollama**: Local LLM integration for privacy and control
- **Supabase**: Authentication, database, and real-time features
- **LangChain**: AI agent framework with memory management
- **PostgreSQL**: Primary database with async support

## Core Concepts

### Constructs (AI Personas)

Constructs are detailed AI personalities with the following structured attributes:

- **Identity**: Name, alias, role, searchable tags
- **Archetype**: Personality archetype and trope classifications
- **Demographics**: Age, gender, species, physical characteristics
- **Psychographics**: Personality, values, fears, desires, beliefs
- **Behavior**: Behavioral patterns, refusal styles, triggers
- **Visual Profile**: Physical appearance, style, aura
- **Voice**: Tone, speech patterns, POV, accent
- **Lore**: Backstory and defining life moments
- **Lifestyle**: Occupation, hobbies, interests, daily routines
- **LLM Tuning**: Temperature, top_p, penalties for AI behavior

### Chat Modes

The system supports multiple interaction modes:

- **chat**: Standard conversational interaction
- **roleplay**: Immersive character roleplay scenarios
- **journal**: Reflective, diary-style interactions
- **story**: Collaborative storytelling mode
- **assist**: Task-focused assistance mode
- **silent**: Minimal response, observation mode

### System Components

#### BAML Integration (`baml_src/`, `baml_client/`)

- Structured persona generation with type safety
- Client generation for Python integration
- Template-based AI prompt construction

#### Database Models (`app/models/`)

- User management with Supabase integration
- Construct storage and relationships
- Chat history and conversation threading

#### API Routes (`app/routers/`)

- Chat completions with agent support
- Construct CRUD operations
- Authentication middleware

#### Services (`app/services/`)

- Model service for Ollama integration
- Chat service for message processing
- Response handling for streaming/sync modes
- Template service for prompt management

## Development Guidelines

### Code Organization

- Follow the existing modular structure
- Keep related functionality grouped in appropriate directories
- Use TypeScript for frontend components
- Follow Python typing conventions for backend code

### AI Persona Creation

When working with constructs:

- Use the BAML schema for structured generation
- Ensure all required fields are populated
- Maintain consistency in personality attributes
- Test personas across different chat modes

### Database Operations

- Use async/await patterns for database operations
- Follow Alembic migration patterns for schema changes
- Maintain foreign key relationships properly
- Use SQLAlchemy ORM patterns consistently

### Frontend Development

- Use shadcn/ui components for consistency
- Follow the established design system
- Implement proper error handling and loading states
- Maintain responsive design principles

### Authentication & Security

- Always validate user authentication via Supabase
- Protect sensitive routes with middleware
- Validate user ownership of constructs
- Sanitize user inputs properly

## Key Files and Directories

### Backend Core

- `app/main.py`: FastAPI application entry point
- `app/routers/`: API endpoint definitions
- `app/models/`: SQLAlchemy database models
- `app/services/`: Business logic and AI integration
- `app/schemas/`: Pydantic models for API validation

### Frontend Core

- `web/app/layout.tsx`: Root layout component
- `web/app/components/`: Reusable UI components
- `web/app/components/avatar/`: Construct-related components
- `web/app/system/`: System management interfaces

### AI & Data

- `baml_src/construct.baml`: BAML schema for persona generation
- `baml_client/`: Generated Python client for BAML
- `app/services/instructions/`: AI prompt templates and instructions

### Configuration

- `pyproject.toml`: Python dependencies and project config
- `web/package.json`: Node.js dependencies
- `alembic.ini`: Database migration configuration
- `supabase/config.toml`: Supabase project configuration

## Project Directory Structure

```
anima-operating-system/
├── pyproject.toml                 # Python dependencies and configuration
├── alembic.ini                    # Database migration configuration
│
├── app/                           # FastAPI backend
│   ├── main.py                    # Application entry point
│   ├── models/                    # Database models (User, Construct)
│   ├── routers/                   # API endpoints (chat, construct)
│   ├── services/                  # Business logic (chat, model, template)
│   ├── schemas/                   # Pydantic validation models
│   ├── middleware/                # Supabase authentication
│   └── db/                        # Database connection
│
├── web/                           # Next.js frontend
│   ├── app/
│   │   ├── components/            # React components
│   │   │   ├── avatar/            # Construct components
│   │   │   └── base/              # shadcn/ui components
│   │   ├── layout.tsx             # Root layout
│   │   └── system/                # System management
│   └── package.json
│
├── alembic/                       # Database migrations
└── supabase/                      # Supabase configuration
```

## Common Patterns

### Creating New Constructs

1. Use BAML GenerateConstruct function for structured generation
2. Validate against Construct schema
3. Store in database with proper user relationships
4. Generate appropriate system prompts for chat interactions

### Chat Implementation

1. Convert chat messages to LangChain format
2. Generate system prompts based on construct and mode
3. Create agent executor with memory management
4. Handle streaming or synchronous responses

### Frontend Components

1. Use TypeScript interfaces for prop definitions
2. Implement proper loading and error states
3. Follow the established design patterns
4. Maintain accessibility standards
