
import React from 'react';
import { GameState, GamePhase } from '../types';

interface TileActionsProps {
  gameState: GameState;
  onAction: (newState: Partial<GameState>) => void;
  onNextPhase: () => void;
  logEvent: (message: string) => void;
}

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = 
({ onClick, disabled = false, children, className = 'bg-success' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-left px-4 py-2 rounded-md text-parchment font-bold transition-all duration-200 shadow-sm disabled:bg-stone/50 disabled:cursor-not-allowed disabled:text-stone/80 hover:enabled:brightness-110 ${className}`}
    >
        {children}
    </button>
);

const TileActions: React.FC<TileActionsProps> = ({ gameState, onAction, onNextPhase, logEvent }) => {
  const { playerPos, world, phase, actionsLeft, coins, peasants } = gameState;
  const currentTile = world[playerPos];
  const isPlayerPhase = phase === GamePhase.Player;
  const isBuildPhase = phase === GamePhase.Build;

  const move = (direction: -1 | 1) => {
    onAction({ playerPos: playerPos + direction, actionsLeft: actionsLeft - 1 });
    logEvent(`You moved to tile ${playerPos + direction + 1}.`);
  };

  const hirePeasant = () => {
    onAction({ coins: coins - 3, peasants: peasants + 1, actionsLeft: actionsLeft - 1, peasantsRecruited: gameState.peasantsRecruited + 1 });
    logEvent("You hired a peasant.");
  };

  const assignArcher = () => {
    const newWorld = JSON.parse(JSON.stringify(world));
    newWorld[playerPos].units.push('Archer');
    onAction({ world: newWorld, peasants: peasants - 1, actionsLeft: actionsLeft - 1, archersTrained: gameState.archersTrained + 1 });
    logEvent("A peasant has taken up the bow!");
  };

  const buildWall = () => {
    const newWorld = JSON.parse(JSON.stringify(world));
    newWorld[playerPos].wall = 1;
    onAction({ world: newWorld, coins: coins - 5, actionsLeft: actionsLeft - 1, wallsBuilt: gameState.wallsBuilt + 1 });
    logEvent("A sturdy wall has been raised.");
  };
  
  const buildFarm = () => {
    const newWorld = JSON.parse(JSON.stringify(world));
    newWorld[playerPos].building = 'Farm';
    onAction({ world: newWorld, coins: coins - 10, actionsLeft: actionsLeft - 1, farmsBuilt: gameState.farmsBuilt + 1 });
    logEvent("A farm is built, ready to provide for the kingdom.");
  };

  const hasActions = actionsLeft > 0;

  return (
    <div className="mt-6 text-center">
      <h3 className="text-xl font-bold mb-4">You are at Tile {playerPos + 1}</h3>
      <p className="mb-4 text-stone h-6">{currentTile.building ? `There is a ${currentTile.building} here.` : 'The land is clear.'}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isPlayerPhase && (
          <>
            <ActionButton onClick={() => move(-1)} disabled={!hasActions || playerPos <= 0}><i className="fas fa-arrow-left w-6"></i> Move Left</ActionButton>
            <ActionButton onClick={() => move(1)} disabled={!hasActions || playerPos >= world.length - 1}><i className="fas fa-arrow-right w-6"></i> Move Right</ActionButton>
            <ActionButton onClick={hirePeasant} disabled={!hasActions || coins < 3}><i className="fas fa-user-plus w-6"></i> Hire Peasant (3 <i className="fas fa-coins text-gold"></i>)</ActionButton>
            <ActionButton onClick={assignArcher} disabled={!hasActions || peasants < 1}><i className="fas fa-crosshairs w-6"></i> Train Archer (1 <i className="fas fa-users"></i>)</ActionButton>
            <ActionButton onClick={onNextPhase} className="bg-info col-span-full"><i className="fas fa-forward w-6"></i> End Player Phase</ActionButton>
          </>
        )}
        {isBuildPhase && (
          <>
            <ActionButton onClick={buildWall} disabled={!hasActions || coins < 5 || currentTile.wall > 0}><i className="fas fa-shield-alt w-6"></i> Build Wall (5 <i className="fas fa-coins text-gold"></i>)</ActionButton>
            <ActionButton onClick={buildFarm} disabled={!hasActions || coins < 10 || !!currentTile.building}><i className="fas fa-tractor w-6"></i> Build Farm (10 <i className="fas fa-coins text-gold"></i>)</ActionButton>
            <ActionButton onClick={onNextPhase} className="bg-info col-span-full"><i className="fas fa-forward w-6"></i> End Build Phase</ActionButton>
          </>
        )}
        {phase === GamePhase.Enemy && <p className="text-danger animate-pulse col-span-full">The Greed are moving...</p>}
        {phase === GamePhase.Income && <p className="text-success col-span-full">Collecting income...</p>}
      </div>
      {!hasActions && (isPlayerPhase || isBuildPhase) && <p className="text-danger mt-4">You have no actions left for this phase.</p>}
    </div>
  );
};

export default TileActions;
