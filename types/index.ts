export type RecipeType = 'hidden_veggies' | 'gourmet';

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime: string;
  cuisine: string;
  type: RecipeType;
  hiddenVeggies?: string[];
}

export interface Meal {
  name: string;
  ingredients: string[];
  recipe?: Recipe;
  type: RecipeType;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface RecipeApiRequest {
  option: {
    id: string;
    name: string;
    type: RecipeType;
  };
  familySize: number;
}

export interface RecipeApiResponse {
  recipe: Recipe;
}