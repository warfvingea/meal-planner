'use client';
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import AIRecipeAssistant from './AIRecipeAssistant';
import { Recipe, Meal } from '@/types';

const MealPlanner: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState('');
  const [shoppingList, setShoppingList] = useState<string[]>([]);
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

  const addMeal = () => {
    if (newMeal.trim()) {
      setMeals([...meals, { 
        name: newMeal, 
        ingredients: [],
        type: 'gourmet' // default type för manuellt tillagda måltider
      }]);
      setNewMeal('');
    }
  };

  const deleteMeal = (mealIndex: number) => {
    setMeals(meals.filter((_, index) => index !== mealIndex));
  };

  const addIngredient = (mealIndex: number, ingredient: string) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients.push(ingredient);
    setMeals(updatedMeals);
  };

  const deleteIngredient = (mealIndex: number, ingredientIndex: number) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients = updatedMeals[mealIndex].ingredients.filter((_, index) => index !== ingredientIndex);
    setMeals(updatedMeals);
  };

  const generateShoppingList = () => {
    const allIngredients = meals.flatMap(meal => meal.ingredients);
    setShoppingList(allIngredients);
  };

  const addRecipeAsMeal = (recipe: Recipe) => {
    setMeals([...meals, {
      name: recipe.name,
      ingredients: recipe.ingredients,
      recipe: recipe,
      type: recipe.type // Använder receptets typ (hidden_veggies eller gourmet)
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AIRecipeAssistant onAddRecipe={addRecipeAsMeal} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Måltidsplanerare</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            placeholder="Ange måltidsnamn..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <button
            onClick={addMeal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Lägg till måltid
          </button>
        </div>
  
        <div className="space-y-4">
          {meals.map((meal, mealIndex) => (
            <div 
              key={mealIndex} 
              className={`border rounded p-4 dark:border-gray-600 ${
                meal.type === 'hidden_veggies' ? 'bg-green-50 dark:bg-green-900' : 'dark:bg-gray-700'
              }`}
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
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
  
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Lägg till ingrediens..."
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addIngredient(mealIndex, e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
  
              <ul className="list-disc ml-6">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i} className="group flex items-center justify-between dark:text-gray-300">
                    <span>{ingredient}</span>
                    <button 
                      onClick={() => deleteIngredient(mealIndex, i)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
  
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Inköpslista</h2>
        <button
          onClick={generateShoppingList}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Generera Inköpslista
        </button>
        <ul className="list-disc ml-6 dark:text-gray-300">
          {shoppingList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealPlanner;