# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Architecture Overview

This is a Next.js 15 meal planning application built with TypeScript and Tailwind CSS. The app integrates with Google's Gemini AI to generate recipes through a secure server-side API.

### Core Components

- **MealPlanner** (`components/MealPlanner.tsx`) - Main component with optimized state management, input validation, and accessibility features
- **AIRecipeAssistant** (`components/AIRecipeAssistant.tsx`) - AI-powered recipe generation with caching and error handling
- **UI Components** (`components/ui/`) - Reusable Button, Input, Card, and ErrorBoundary components
- **Types** (`types/index.ts`) - Comprehensive TypeScript interfaces with API types

### Security & Performance Optimizations

- **Server-side API**: Recipe generation moved to `/app/api/recipes/route.ts` to secure API keys
- **Performance**: Components use `useCallback`, `useMemo`, and efficient state updates
- **Validation**: Input sanitization and validation in `lib/validation.ts`
- **Error Handling**: Error boundaries and comprehensive error states
- **Caching**: Recipe caching to reduce API calls

### Accessibility Features

- Semantic HTML with proper ARIA labels and roles
- Screen reader support with skip navigation
- Keyboard navigation and focus management
- Reduced motion support for accessibility
- Swedish language metadata and locale settings

### Key Features

- **Recipe Types**: Two categories - `hidden_veggies` (kid-friendly) and `gourmet` (sophisticated cuisine)
- **AI Integration**: Secure server-side Gemini API integration with input validation
- **Persistence**: localStorage with automatic sync
- **Responsive Design**: Dark mode support and mobile-first design

### Data Flow

1. User selects recipe type in AIRecipeAssistant
2. Request sent to `/api/recipes` with validation
3. Server-side API calls Gemini with sanitized inputs
4. Generated recipes cached and displayed
5. Users add recipes to MealPlanner with optimized state updates
6. Shopping list auto-generated via memoization

### Environment Variables

- `GEMINI_API_KEY` - Server-side only, required for AI recipe generation
- Remove any `NEXT_PUBLIC_GEMINI_API_KEY` from client-side code

### Language & Localization

Swedish-language application with proper locale settings and accessibility in Swedish.