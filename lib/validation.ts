import { VALIDATION } from './constants';

export const validateMealName = (name: string): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return 'Måltidsnamn krävs';
  if (trimmed.length < VALIDATION.MEAL_NAME.MIN_LENGTH) {
    return `Måltidsnamn måste vara minst ${VALIDATION.MEAL_NAME.MIN_LENGTH} tecken`;
  }
  if (trimmed.length > VALIDATION.MEAL_NAME.MAX_LENGTH) {
    return `Måltidsnamn får vara max ${VALIDATION.MEAL_NAME.MAX_LENGTH} tecken`;
  }
  return null;
};

export const validateIngredient = (ingredient: string): string | null => {
  const trimmed = ingredient.trim();
  if (!trimmed) return 'Ingrediens krävs';
  if (trimmed.length < VALIDATION.INGREDIENT.MIN_LENGTH) {
    return 'Ingrediens får inte vara tom';
  }
  if (trimmed.length > VALIDATION.INGREDIENT.MAX_LENGTH) {
    return `Ingrediens får vara max ${VALIDATION.INGREDIENT.MAX_LENGTH} tecken`;
  }
  return null;
};

export const validateFamilySize = (size: number): string | null => {
  if (!Number.isInteger(size) || size < VALIDATION.FAMILY_SIZE.MIN) {
    return `Antal personer måste vara minst ${VALIDATION.FAMILY_SIZE.MIN}`;
  }
  if (size > VALIDATION.FAMILY_SIZE.MAX) {
    return `Antal personer får vara max ${VALIDATION.FAMILY_SIZE.MAX}`;
  }
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};