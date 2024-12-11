'use client'
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recipe, RecipeType } from '@/types';

interface RecipeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: RecipeType;
}

const recipeOptions: RecipeOption[] = [
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

const AIRecipeAssistant = ({ onAddRecipe }: { onAddRecipe: (recipe: Recipe) => void }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Recipe | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getRecipeSuggestion = async (option: RecipeOption) => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error('API key is missing');
      alert('API key is not configured');
      return;
    }
  
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      let prompt;
      if (option.type === 'hidden_veggies') {
        prompt = `Du är en kreativ kock som skriver på svenska. 
        Skapa ett recept där grönsaker är smart dolda i en barnfavorit. 
        Receptet ska vara för en familj på 4 personer.
        VIKTIGT: Skriv alla ingredienser, instruktioner och beskrivningar på svenska.
        Returnera endast ett JSON-objekt i detta format:
        {
          "name": "Rättens namn på svenska",
          "description": "Kort beskrivning på svenska",
          "ingredients": ["ingrediens 1 med mängd", "ingrediens 2 med mängd"],
          "instructions": ["steg 1", "steg 2"],
          "servings": 4,
          "prepTime": "30 minuter",
          "cuisine": "Barnvänligt",
          "type": "hidden_veggies",
          "hiddenVeggies": ["gömd grönsak 1", "gömd grönsak 2"]
        }`;
      } else {
        prompt = `Du är en mästerkock specialiserad på ${option.name} som skriver på svenska. 
        Skapa ett sofistikerat men genomförbart recept för en familj på 4 personer.
        Receptet ska vara elegant men inte för komplicerat.
        VIKTIGT: Skriv ALLA ingredienser, instruktioner och beskrivningar på svenska.
        Enheter ska anges i dl, msk, tsk, gram eller styck.
        Returnera endast ett JSON-objekt i detta format:
        {
          "name": "Rättens namn på svenska",
          "description": "Kort beskrivning på svenska",
          "ingredients": ["ingrediens 1 med mängd", "ingrediens 2 med mängd"],
          "instructions": ["steg 1", "steg 2"],
          "servings": 4,
          "prepTime": "45 minuter",
          "cuisine": "${option.id}",
          "type": "gourmet"
        }`;
      }
  
      

      const  result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const recipe = JSON.parse(jsonMatch[0]);
      setSuggestion(recipe);
      setSelectedOption(option.id);
    } catch (error) {
      console.error('Error getting recipe:', error);
      alert('Could not get recipe suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">AI Receptassistent</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {recipeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => getRecipeSuggestion(option)}
            disabled={loading}
            className={`
              p-4 rounded-lg border transition-all
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-md'}
              ${selectedOption === option.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600'}
              ${option.type === 'hidden_veggies' ? 'md:col-span-3 lg:col-span-5 bg-green-50 dark:bg-green-900' : ''}
              dark:text-white dark:hover:border-blue-400
            `}
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className="font-semibold">{option.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{option.description}</div>
          </button>
        ))}
      </div>
  
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
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
  
          <button
            onClick={() => onAddRecipe(suggestion)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Lägg till i Måltidsplanen
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRecipeAssistant;