import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, GameObjective, GameState } from './types';
import { INITIAL_GAME_STATE, OBJECTIVES } from './constants';
import HUD from './components/HUD';
import Minimap from './components/Minimap';
import TileActions from './components/TileActions';
import Objectives from './components/Objectives';
import EventLog from './components/EventLog';
import GeminiEvent from './components/GeminiEvent';

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [objectives, setObjectives] = useState<GameObjective[]>(OBJECTIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const logEvent = useCallback((message: string) => {
    setGameState(prev => ({
      ...prev,
      eventLog: [message, ...prev.eventLog] // Prepend new event without slicing
    }));
  }, []);

  const checkObjectives = useCallback(() => {
    const newObjectives = [...objectives];
    let changed = false;
    let newActions = 0;
    let newCoins = 0;
    let newPeasants = 0;

    newObjectives.forEach(obj => {
      if (obj.completed) return;

      let conditionMet = false;
      const targetKey = obj.target as keyof GameState;
      
      // Type guard to ensure we are dealing with expected types.
      if (typeof gameState[targetKey] === 'number' && typeof obj.value === 'number') {
        const currentValue = gameState[targetKey] as number;
        if (currentValue >= obj.value) {
            conditionMet = true;
        }
      }
      
      if(conditionMet){
        obj.completed = true;
        changed = true;
        logEvent(`Objective complete: ${obj.text}`);
        if(obj.reward_type === "coins") newCoins += obj.reward_value;
        if(obj.reward_type === "peasants") newPeasants += obj.reward_value;
        if(obj.reward_type === "extra_action") newActions += obj.reward_value;
      }
    });

    if (changed) {
      setObjectives(newObjectives);
      setGameState(prev => ({
        ...prev,
        coins: prev.coins + newCoins,
        peasants: prev.peasants + newPeasants,
        actionsLeft: prev.actionsLeft + newActions,
      }));
    }
  }, [objectives, gameState, logEvent]);


  useEffect(() => {
    checkObjectives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.day, gameState.enemiesDefeated, gameState.farmsBuilt, gameState.wallsBuilt, gameState.peasantsRecruited, gameState.archersTrained]);


  const nextPhase = useCallback(() => {
    switch (gameState.phase) {
      case GamePhase.Player:
        setGameState(prev => ({ ...prev, phase: GamePhase.Build, actionsLeft: 2 }));
        logEvent("Build phase begins. Construct your defenses.");
        break;
      case GamePhase.Build:
        setGameState(prev => ({ ...prev, phase: GamePhase.Enemy }));
        logEvent("Night falls. The Greed advance...");
        break;
      case GamePhase.Enemy:
        setGameState(prev => ({ ...prev, phase: GamePhase.Income }));
        logEvent("The sun rises. You survived the night.");
        break;
      case GamePhase.Income:
        const income = gameState.world.filter(t => t.building === 'Farm').length * 2;
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + income,
          day: prev.day + 1,
          phase: GamePhase.Player,
          actionsLeft: 2,
          enemies: [], // Clear enemies for the new day
        }));
        logEvent(`You collected ${income} coins from your farms.`);
        break;
    }
  }, [gameState.phase, gameState.world, logEvent]);

  // Enemy Phase Logic
  useEffect(() => {
    if (gameState.phase === GamePhase.Enemy) {
      const timer = setTimeout(() => {
        let newWorld = JSON.parse(JSON.stringify(gameState.world));
        let gameOver = false;
        let enemiesDefeatedThisTurn = 0;

        // --- SPAWN LOGIC ---
        let currentEnemies = [...gameState.enemies];
        if (gameState.day > 0 && Math.random() < 0.5 + gameState.day * 0.05) {
            const spawnPos = Math.random() < 0.5 ? 0 : 19;
            const newEnemy = { pos: spawnPos, hp: 1 };
            currentEnemies.push(newEnemy);
            logEvent(`A Greed with ${newEnemy.hp} HP appears at tile ${newEnemy.pos + 1}!`);
        }
        
        // --- MOVEMENT & ATTACK LOGIC ---
        const enemiesAfterMove = [];
        
        for (const enemy of currentEnemies) {
            const originalPos = enemy.pos;
            const newPos = enemy.pos + (enemy.pos < gameState.crownPos ? 1 : -1);
            const distance = Math.abs(newPos - originalPos);

            logEvent(`A Greed moves ${distance} tile(s) from ${originalPos + 1} to ${newPos + 1}.`);

            if (newPos === gameState.crownPos) {
              gameOver = true;
              logEvent("The Greed has reached your crown! The kingdom has fallen.");
              break; 
            }

            const tile = newWorld[newPos];
            let defeated = false;

            if (tile.units.includes("Archer")) {
                logEvent(`...it is met by an archer at tile ${newPos + 1} and is defeated!`);
                tile.units.pop();
                defeated = true;
                enemiesDefeatedThisTurn++;
            } else if (tile.wall > 0) {
                logEvent(`...it crashes against a wall at tile ${newPos + 1} and is destroyed! The wall is damaged.`);
                tile.wall--;
                defeated = true;
                enemiesDefeatedThisTurn++;
            }

            if (!defeated) {
                enemiesAfterMove.push({ ...enemy, pos: newPos });
            }
        }
        
        if (gameOver) {
          setIsGameOver(true);
        } else {
          setGameState(prev => ({
            ...prev,
            enemies: enemiesAfterMove,
            world: newWorld,
            enemiesDefeated: prev.enemiesDefeated + enemiesDefeatedThisTurn,
          }));
          nextPhase();
        }

      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase, gameState.enemies, gameState.world, gameState.crownPos, gameState.day, gameState.enemiesDefeated, logEvent, nextPhase]);

  // Income Phase Logic
  useEffect(() => {
    if (gameState.phase === GamePhase.Income) {
      const timer = setTimeout(() => {
        nextPhase();
      }, 1500); // Wait a moment before collecting income and starting the new day
      return () => clearTimeout(timer);
    }
  }, [gameState.phase, nextPhase]);

  const handleAction = (newState: Partial<GameState>) => {
    setGameState(prev => ({...prev, ...newState}));
  };

  const handleRestart = () => {
    setGameState(INITIAL_GAME_STATE);
    setObjectives(OBJECTIVES.map(o => ({...o, completed: false})));
    setIsGameOver(false);
    setShowIntro(true);
  };
  
  if (showIntro) {
    return (
       <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
        <div className="max-w-3xl bg-stone/10 p-8 rounded-lg shadow-2xl border-2 border-wood/50 text-center">
            <h1 className="text-4xl font-bold text-wood mb-4">Kingdom Reborn: A Gemini Chronicle</h1>
            <p className="text-lg mb-6 text-stone">
                An analysis and reimplementation of a classic text-based kingdom management game. This modern version is built with React and Tailwind CSS, featuring an enhanced UI and dynamic, AI-generated events powered by the Gemini API to create a unique experience each time you play.
            </p>
            <h2 className="text-2xl font-bold text-wood mb-2">Your Quest</h2>
            <p className="mb-6 text-stone">
                As Monarch, your goal is to defend your crown from the encroaching "Greed". Manage your coins, hire peasants, build farms for income, and raise walls and archers for defense. Survive each night's onslaught and expand your kingdom.
            </p>
            <button
                onClick={() => setShowIntro(false)}
                className="bg-wood text-parchment font-bold py-3 px-8 rounded-lg hover:bg-stone transition-colors shadow-md text-xl"
            >
                Begin Your Reign
            </button>
        </div>
       </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-danger/80 flex items-center justify-center p-4">
        <div className="max-w-xl bg-parchment p-8 rounded-lg shadow-2xl border-2 border-wood/50 text-center">
          <h1 className="text-5xl font-bold text-danger mb-4">Game Over</h1>
          <p className="text-xl mb-6 text-stone">You survived for {gameState.day} days.</p>
          <button
            onClick={handleRestart}
            className="bg-wood text-parchment font-bold py-3 px-8 rounded-lg hover:bg-stone transition-colors shadow-md text-xl"
          >
            Reclaim Your Kingdom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-serif">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-wood">Kingdom Reborn</h1>
        <p className="text-stone">A Chronicle Powered by Gemini</p>
      </div>
      
      <HUD gameState={gameState} />
      
      {gameState.day > 1 && gameState.phase === GamePhase.Player && <GeminiEvent key={gameState.day} gameState={gameState} logEvent={logEvent} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 bg-stone/10 p-6 rounded-lg shadow-lg border-2 border-wood/20">
            <h2 className="text-2xl font-bold mb-4 text-center text-wood">{gameState.phase}</h2>
            <Minimap world={gameState.world} playerPos={gameState.playerPos} crownPos={gameState.crownPos} enemies={gameState.enemies} />
            <TileActions gameState={gameState} onAction={handleAction} onNextPhase={nextPhase} logEvent={logEvent} />
        </div>

        <div className="space-y-8">
            <Objectives objectives={objectives} />
            <EventLog events={gameState.eventLog} />
        </div>
      </div>
    </div>
  );
}

export default App;
