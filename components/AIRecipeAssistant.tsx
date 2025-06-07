'use client'
import React, { useState, useCallback } from 'react';
import { Recipe } from '@/types';
import { RECIPE_OPTIONS, RecipeOption } from '@/lib/constants';
import { validateFamilySize } from '@/lib/validation';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface AIRecipeAssistantProps {
  onAddRecipe: (recipe: Recipe) => void;
}

const AIRecipeAssistant: React.FC<AIRecipeAssistantProps> = ({ onAddRecipe }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Recipe | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [familySize, setFamilySize] = useState<number>(4);
  const [familySizeError, setFamilySizeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipeCache] = useState<Map<string, Recipe>>(new Map());

  const getRecipeSuggestion = useCallback(async (option: RecipeOption) => {
    const validationError = validateFamilySize(familySize);
    if (validationError) {
      setFamilySizeError(validationError);
      return;
    }

    const cacheKey = `${option.id}-${familySize}`;
    if (recipeCache.has(cacheKey)) {
      const cachedRecipe = recipeCache.get(cacheKey)!;
      setSuggestion(cachedRecipe);
      setSelectedOption(option.id);
      return;
    }
  
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option,
          familySize
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      const recipe = data.recipe;
      
      recipeCache.set(cacheKey, recipe);
      setSuggestion(recipe);
      setSelectedOption(option.id);
    } catch (error) {
      console.error('Error getting recipe:', error);
      setError(error instanceof Error ? error.message : 'Kunde inte generera recept. Försök igen.');
    } finally {
      setLoading(false);
    }
  }, [familySize, recipeCache]);

  const handleFamilySizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFamilySize(value);
    if (familySizeError) setFamilySizeError(null);
  }, [familySizeError]);

  const addRecipeToMealPlan = useCallback(() => {
    if (suggestion) {
      onAddRecipe(suggestion);
    }
  }, [suggestion, onAddRecipe]);

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">AI Receptassistent</h2>
      
      <div className="mb-4">
        <Input
          label="Antal personer"
          type="number"
          value={familySize.toString()}
          onChange={handleFamilySizeChange}
          min={1}
          max={20}
          className="w-24"
          error={familySizeError || undefined}
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900 dark:border-red-700">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {RECIPE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => getRecipeSuggestion(option)}
            disabled={loading}
            className={`
              p-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-md'}
              ${selectedOption === option.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600'}
              ${option.type === 'hidden_veggies' ? 'md:col-span-3 lg:col-span-5 bg-green-50 dark:bg-green-900' : ''}
              dark:text-white dark:hover:border-blue-400
            `}
            aria-label={`Generera ${option.name} recept`}
          >
            <div className="text-2xl mb-2" role="img" aria-label={option.name}>{option.icon}</div>
            <div className="font-semibold">{option.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{option.description}</div>
          </button>
        ))}
      </div>
  
      {loading && (
        <div className="text-center py-4" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" aria-hidden="true"></div>
          <p className="mt-2 dark:text-white">Genererar recept...</p>
        </div>
      )}
  
      {suggestion && (
        <div className="mt-4 p-4 border rounded dark:border-gray-600">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl mb-2 dark:text-white">{suggestion.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{suggestion.description}</p>
            </div>
            <div className="text-right text-sm text-gray-600 dark:text-gray-300">
              <div>Portioner: {suggestion.servings}</div>
              <div>Tillagningstid: {suggestion.prepTime}</div>
            </div>
          </div>
          
          {suggestion.type === 'hidden_veggies' && suggestion.hiddenVeggies && (
            <div className="mb-4 bg-green-50 dark:bg-green-900 p-3 rounded">
              <h4 className="font-semibold dark:text-white">Gömda Grönsaker:</h4>
              <ul className="list-disc ml-6 dark:text-gray-300">
                {suggestion.hiddenVeggies.map((veg, i) => (
                  <li key={i}>{veg}</li>
                ))}
              </ul>
            </div>
          )}
  
          <div className="mb-4">
            <h4 className="font-semibold dark:text-white">Ingredienser:</h4>
            <ul className="list-disc ml-6 dark:text-gray-300">
              {suggestion.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
  
          <div className="mb-4">
            <h4 className="font-semibold dark:text-white">Instruktioner:</h4>
            <ol className="list-decimal ml-6 dark:text-gray-300">
              {suggestion.instructions.map((step, i) => (
                <li key={i} className="mb-2">{step}</li>
              ))}
            </ol>
          </div>
  
          <Button onClick={addRecipeToMealPlan}>
            Lägg till i Måltidsplanen
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIRecipeAssistant;