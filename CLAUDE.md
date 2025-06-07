# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Architecture Overview

This is a Next.js 15 meal planning application built with TypeScript and Tailwind CSS. The app integrates with Google's Gemini AI to generate recipes.

### Core Components

- **MealPlanner** (`components/MealPlanner.tsx`) - Main component managing meals and shopping list with localStorage persistence
- **AIRecipeAssistant** (`components/AIRecipeAssistant.tsx`) - AI-powered recipe generation with categorized recipe types
- **Types** (`types/index.ts`) - Shared TypeScript interfaces for Recipe and Meal

### Key Features

- **Recipe Types**: Two main categories - `hidden_veggies` (kid-friendly with hidden vegetables) and `gourmet` (sophisticated cuisine)
- **AI Integration**: Uses Google Gemini API (`@google/generative-ai`) to generate Swedish-language recipes
- **Persistence**: Meals are saved to localStorage and restored on page load
- **Responsive Design**: Uses Tailwind CSS with dark mode support

### Data Flow

1. User selects recipe type in AIRecipeAssistant
2. Component calls Gemini API with Swedish prompts
3. Generated recipes are parsed from JSON and displayed
4. Users can add recipes to MealPlanner as meals
5. MealPlanner manages ingredients and generates shopping lists
6. All data persists in localStorage

### Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY` - Required for AI recipe generation

### Language & Localization

The application is Swedish-language focused with all AI prompts, UI text, and generated content in Swedish.