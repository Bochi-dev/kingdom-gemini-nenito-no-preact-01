
import React from 'react';
import { GameState } from '../types';

interface HUDProps {
  gameState: GameState;
}

const HUD: React.FC<HUDProps> = ({ gameState }) => {
  const { day, coins, peasants, actionsLeft, phase } = gameState;

  return (
    <div className="bg-wood text-parchment p-4 rounded-lg shadow-md flex justify-around items-center text-center">
      <div className="flex items-center space-x-2">
        <i className="fas fa-sun text-2xl text-gold"></i>
        <div>
          <div className="text-sm font-bold uppercase">Day</div>
          <div className="text-2xl font-bold">{day}</div>
        </div>
      </div>
      <div className="w-px h-12 bg-parchment/30"></div>
      <div className="flex items-center space-x-2">
        <i className="fas fa-coins text-2xl text-gold"></i>
        <div>
          <div className="text-sm font-bold uppercase">Coins</div>
          <div className="text-2xl font-bold">{coins}</div>
        </div>
      </div>
      <div className="w-px h-12 bg-parchment/30"></div>
       <div className="flex items-center space-x-2">
        <i className="fas fa-users text-2xl text-gold"></i>
        <div>
          <div className="text-sm font-bold uppercase">Peasants</div>
          <div className="text-2xl font-bold">{peasants}</div>
        </div>
      </div>
      <div className="w-px h-12 bg-parchment/30"></div>
      <div className="flex items-center space-x-2">
        <i className="fas fa-bolt text-2xl text-gold"></i>
        <div>
          <div className="text-sm font-bold uppercase">Actions Left</div>
          <div className="text-2xl font-bold">{phase === 'Player Phase' || phase === 'Build Phase' ? actionsLeft : '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default HUD;
