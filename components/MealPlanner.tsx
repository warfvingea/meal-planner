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
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Måltidsplanerare</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            placeholder="Ange måltidsnamn..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addMeal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lägg till måltid
          </button>
        </div>

        <div className="space-y-4">
          {meals.map((meal, mealIndex) => (
            <div 
              key={mealIndex} 
              className={`border rounded p-4 ${
                meal.type === 'hidden_veggies' ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold">{meal.name}</h3>
                  {meal.recipe && (
                    <p className="text-sm text-gray-600">
                      Tillagningstid: {meal.recipe.prepTime} | Portioner: {meal.recipe.servings}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => deleteMeal(mealIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {meal.recipe?.type === 'hidden_veggies' && meal.recipe.hiddenVeggies && (
                <div className="mb-4 bg-green-100 p-3 rounded">
                  <h4 className="font-semibold">Gömda Grönsaker:</h4>
                  <ul className="list-disc ml-6">
                    {meal.recipe.hiddenVeggies.map((veg, i) => (
                      <li key={i}>{veg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Lägg till ingrediens..."
                  className="flex-1 p-2 border rounded"
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
                  <li key={i} className="group flex items-center justify-between">
                    <span>{ingredient}</span>
                    <button 
                      onClick={() => deleteIngredient(mealIndex, i)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Inköpslista</h2>
        <button
          onClick={generateShoppingList}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          Generera Inköpslista
        </button>
        <ul className="list-disc ml-6">
          {shoppingList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealPlanner;