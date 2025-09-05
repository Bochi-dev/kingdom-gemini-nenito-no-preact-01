
import { GoogleGenAI } from "@google/genai";
import { GameState } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateGameEvent(gameState: GameState): Promise<string> {
  if (!API_KEY) {
    const backupEvents = [
      "A quiet day dawns over the kingdom.",
      "The wind whispers secrets through the trees.",
      "A travelling merchant passes by, but does not stop.",
      "Your subjects seem content today.",
      "Dark clouds gather on the horizon, a bad omen perhaps."
    ];
    return backupEvents[Math.floor(Math.random() * backupEvents.length)];
  }

  const farmCount = gameState.world.filter(t => t.building === 'Farm').length;
  
  const prompt = `
  You are a storyteller for a dark fantasy kingdom management game. 
  Generate a single, short, flavorful event description for the start of a new day.
  The event can be positive, negative, or neutral. Keep it to one or two sentences.

  Current game state:
  - Day: ${gameState.day}
  - Coins: ${gameState.coins}
  - Peasants: ${gameState.peasants}
  - Farms: ${farmCount}
  - Archers: ${gameState.world.flatMap(t => t.units).length}

  Do not output anything other than the event description text.

  Example positive event: "A bountiful harvest fills your coffers with unexpected coin."
  Example neutral event: "A dense fog rolls in, cloaking the kingdom in an eerie silence."
  Example negative event: "A sickness spreads through a nearby peasant camp, slowing recruitment."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating event from Gemini:", error);
    return "A strange silence falls over the land.";
  }
}
