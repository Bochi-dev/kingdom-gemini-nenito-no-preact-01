
import React, { useState, useEffect } from 'react';
import { generateGameEvent } from '../services/geminiService';
import { GameState } from '../types';

interface GeminiEventProps {
  gameState: GameState;
  logEvent: (message: string) => void;
}

const GeminiEvent: React.FC<GeminiEventProps> = ({ gameState, logEvent }) => {
  const [event, setEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setEvent(null);
      try {
        const generatedEvent = await generateGameEvent(gameState);
        setEvent(generatedEvent);
        logEvent(`Event: ${generatedEvent}`);
      } catch (error) {
        setEvent("The air is still today, carrying no news.");
      } finally {
        setIsLoading(false);
      }
    };

    // We only want to fetch a new event when the day changes.
    // The key on the component in App.tsx ensures it re-mounts each day.
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array is correct because the component re-mounts each day via the key prop.

  return (
    <div className="my-6 p-4 bg-amber-100 border-l-4 border-amber-500 text-amber-800 rounded-r-lg shadow-md">
      <h4 className="font-bold mb-1">A New Day's Tidings</h4>
      {isLoading ? (
        <p className="italic animate-pulse">The winds of fate are stirring...</p>
      ) : (
        <p className="italic">"{event}"</p>
      )}
    </div>
  );
};

// Memoize the component to prevent re-renders when parent state changes but day doesn't.
export default React.memo(GeminiEvent);
