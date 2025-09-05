
import React from 'react';
import { WorldTile, Enemy } from '../types';

interface MinimapProps {
  world: WorldTile[];
  playerPos: number;
  crownPos: number;
  enemies: Enemy[];
}

const TileIcon: React.FC<{ icon: string; title: string; extraClasses?: string }> = ({ icon, title, extraClasses }) => (
    <div title={title} className={`w-8 h-8 md:w-10 md:h-10 border-2 border-wood/30 rounded-md flex items-center justify-center text-xl relative transition-all duration-200 ${extraClasses}`}>
        <i className={`fas ${icon}`}></i>
    </div>
);

const Minimap: React.FC<MinimapProps> = ({ world, playerPos, crownPos, enemies }) => {
  return (
    <div className="bg-stone/5 p-2 rounded-md mb-4">
        <div className="flex justify-center gap-1">
        {world.map((tile, i) => {
            const isPlayerHere = i === playerPos;
            const isCrownHere = i === crownPos;
            const enemyHere = enemies.find(e => e.pos === i);
            
            let icon = "fa-circle";
            let title = `Tile ${i + 1}: Empty`;
            let tileClass = "text-stone/30";
            
            if (isPlayerHere) {
                icon = "fa-chess-king";
                title = `You are here (Tile ${i + 1})`;
                tileClass = "text-blue-600 scale-125 z-10 bg-blue-100";
            } else if (isCrownHere) {
                icon = "fa-crown";
                title = `Your Crown (Tile ${i + 1})`;
                tileClass = "text-gold";
            } else if (enemyHere) {
                icon = "fa-ghost";
                title = `Greed! (Tile ${i + 1})`;
                tileClass = "text-danger animate-pulse";
            } else if (tile.units.includes("Archer")) {
                icon = "fa-crosshairs";
                title = `Archer (Tile ${i + 1})`;
                tileClass = "text-green-700";
            } else if (tile.wall > 0) {
                icon = "fa-shield-alt";
                title = `Wall (Tile ${i + 1})`;
                tileClass = "text-stone";
            } else if (tile.building === 'Farm') {
                icon = "fa-tractor";
                title = `Farm (Tile ${i + 1})`;
                tileClass = "text-yellow-600";
            }

            return <TileIcon key={i} icon={icon} title={title} extraClasses={tileClass} />;
        })}
        </div>
    </div>
  );
};

export default Minimap;
