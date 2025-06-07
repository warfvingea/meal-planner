'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import AIRecipeAssistant from './AIRecipeAssistant';
import { Recipe, Meal } from '@/types';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { validateMealName, validateIngredient, sanitizeInput } from '@/lib/validation';

const MealPlanner: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState('');
  const [newMealError, setNewMealError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  }, [meals, isLoaded]);

  const addMeal = useCallback(() => {
    const sanitized = sanitizeInput(newMeal);
    const error = validateMealName(sanitized);
    
    if (error) {
      setNewMealError(error);
      return;
    }
    
    setMeals(prevMeals => [...prevMeals, { 
      name: sanitized.trim(), 
      ingredients: [],
      type: 'gourmet'
    }]);
    setNewMeal('');
    setNewMealError(null);
  }, [newMeal]);

  const deleteMeal = useCallback((mealIndex: number) => {
    setMeals(prevMeals => prevMeals.filter((_, index) => index !== mealIndex));
  }, []);

  const addIngredient = useCallback((mealIndex: number, ingredient: string) => {
    const sanitized = sanitizeInput(ingredient);
    const error = validateIngredient(sanitized);
    
    if (error) return false;
    
    setMeals(prevMeals => {
      const updatedMeals = [...prevMeals];
      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        ingredients: [...updatedMeals[mealIndex].ingredients, sanitized.trim()]
      };
      return updatedMeals;
    });
    return true;
  }, []);

  const deleteIngredient = useCallback((mealIndex: number, ingredientIndex: number) => {
    setMeals(prevMeals => {
      const updatedMeals = [...prevMeals];
      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        ingredients: updatedMeals[mealIndex].ingredients.filter((_, index) => index !== ingredientIndex)
      };
      return updatedMeals;
    });
  }, []);

  const shoppingList = useMemo(() => {
    return meals.flatMap(meal => meal.ingredients);
  }, [meals]);

  const addRecipeAsMeal = useCallback((recipe: Recipe) => {
    setMeals(prevMeals => [...prevMeals, {
      name: recipe.name,
      ingredients: recipe.ingredients,
      recipe: recipe,
      type: recipe.type
    }]);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addMeal();
    }
  }, [addMeal]);

  const handleIngredientKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>, mealIndex: number) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const success = addIngredient(mealIndex, e.currentTarget.value.trim());
      if (success) {
        e.currentTarget.value = '';
      }
    }
  }, [addIngredient]);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="sr-only">Måltidsplanerare - Planera dina veckomåltider</h1>
      <AIRecipeAssistant onAddRecipe={addRecipeAsMeal} />
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Måltidsplanerare</h2>
        
        <div className="flex gap-2 mb-6">
          <Input
            label="Lägg till ny måltid"
            value={newMeal}
            onChange={(e) => {
              setNewMeal(e.target.value);
              if (newMealError) setNewMealError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ange måltidsnamn..."
            error={newMealError || undefined}
            className="flex-1"
            required
          />
          <Button
            onClick={addMeal}
            disabled={!newMeal.trim()}
            className="mt-6"
          >
            Lägg till måltid
          </Button>
        </div>
  
        <section className="space-y-4" aria-label="Måltidslista">
          {meals.map((meal, mealIndex) => (
            <Card 
              key={mealIndex} 
              variant={meal.type === 'hidden_veggies' ? 'green' : 'default'}
              className="border dark:border-gray-600"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold dark:text-white">{meal.name}</h3>
                  {meal.recipe && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tillagningstid: {meal.recipe.prepTime} | Portioner: {meal.recipe.servings}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => deleteMeal(mealIndex)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Ta bort måltid ${meal.name}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
  
              <div className="mb-2">
                <Input
                  placeholder="Lägg till ingrediens..."
                  onKeyPress={(e) => handleIngredientKeyPress(e, mealIndex)}
                  aria-label={`Lägg till ingrediens för ${meal.name}`}
                />
              </div>
  
              <ul className="list-disc ml-6" role="list">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i} className="group flex items-center justify-between dark:text-gray-300" role="listitem">
                    <span>{ingredient}</span>
                    <button 
                      onClick={() => deleteIngredient(mealIndex, i)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity dark:text-red-400 dark:hover:text-red-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:opacity-100"
                      aria-label={`Ta bort ingrediens ${ingredient}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>
      </Card>
  
      <Card>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Inköpslista</h2>
        {shoppingList.length > 0 ? (
          <ul className="list-disc ml-6 dark:text-gray-300" role="list">
            {shoppingList.map((item, index) => (
              <li key={index} role="listitem">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Inga ingredienser att visa. Lägg till måltider för att generera en inköpslista.</p>
        )}
      </Card>
    </main>
  );
};

export default MealPlanner;