import { RecipeType } from '@/types';

export interface RecipeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: RecipeType;
}

export const RECIPE_OPTIONS: RecipeOption[] = [
  {
    id: 'hidden_veggies',
    name: 'Barnfavoriter med Dolda Grönsaker',
    description: 'Barnvänliga rätter där grönsakerna är listigt gömda',
    icon: '🥕',
    type: 'hidden_veggies'
  },
  {
    id: 'swedish',
    name: 'Svensk Gourmet',
    description: 'Förfinad svensk husmanskost',
    icon: '👨‍🍳',
    type: 'gourmet'
  },
  {
    id: 'italian',
    name: 'Italiensk Gourmet',
    description: 'Elegant italiensk matlagning',
    icon: '🍝',
    type: 'gourmet'
  },
  {
    id: 'french',
    name: 'Fransk Gourmet',
    description: 'Klassisk fransk fine dining',
    icon: '🥖',
    type: 'gourmet'
  },
  {
    id: 'asian',
    name: 'Asiatisk Gourmet',
    description: 'Sofistikerad asiatisk fusion',
    icon: '🥢',
    type: 'gourmet'
  },
  {
    id: 'middleeastern',
    name: 'Mellanöstern Gourmet',
    description: 'Aromatisk mat från Mellanöstern',
    icon: '🧆',
    type: 'gourmet'
  }
];

export const VALIDATION = {
  MEAL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  INGREDIENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  FAMILY_SIZE: {
    MIN: 1,
    MAX: 20
  }
} as const;