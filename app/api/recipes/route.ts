import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { option, familySize } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Input validation
    if (!option || !option.id || !option.name || !option.type) {
      return NextResponse.json(
        { error: "Invalid recipe option" },
        { status: 400 }
      );
    }

    if (!familySize || familySize < 1 || familySize > 20) {
      return NextResponse.json(
        { error: "Invalid family size" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt;
    if (option.type === 'hidden_veggies') {
      prompt = `Du är en kreativ kock som skriver på svenska. 
      Skapa ett recept där grönsaker är smart dolda i en barnfavorit. 
      Receptet ska vara för en familj på ${familySize} personer.
      VIKTIGT: Skriv alla ingredienser, instruktioner och beskrivningar på svenska.
      Returnera endast ett JSON-objekt i detta format:
      {
        "name": "Rättens namn på svenska",
        "description": "Kort beskrivning på svenska",
        "ingredients": ["ingrediens 1 med mängd", "ingrediens 2 med mängd"],
        "instructions": ["steg 1", "steg 2"],
        "servings": ${familySize},
        "prepTime": "30 minuter",
        "cuisine": "Barnvänligt",
        "type": "hidden_veggies",
        "hiddenVeggies": ["gömd grönsak 1", "gömd grönsak 2"]
      }`;
    } else {
      prompt = `Du är en mästerkock specialiserad på ${option.name} som skriver på svenska. 
      Skapa ett sofistikerat men genomförbart recept för en familj på ${familySize} personer.
      Receptet ska vara elegant men inte för komplicerat.
      VIKTIGT: Skriv ALLA ingredienser, instruktioner och beskrivningar på svenska.
      Enheter ska anges i dl, msk, tsk, gram eller styck.
      Returnera endast ett JSON-objekt i detta format:
      {
        "name": "Rättens namn på svenska",
        "description": "Kort beskrivning på svenska",
        "ingredients": ["ingrediens 1 med mängd", "ingrediens 2 med mängd"],
        "instructions": ["steg 1", "steg 2"],
        "servings": ${familySize},
        "prepTime": "45 minuter",
        "cuisine": "${option.id}",
        "type": "gourmet"
      }`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const recipe = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!recipe.name || !recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      throw new Error('Invalid recipe structure');
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}