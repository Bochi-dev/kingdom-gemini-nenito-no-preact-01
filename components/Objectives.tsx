
import React from 'react';
import { GameObjective } from '../types';

interface ObjectivesProps {
  objectives: GameObjective[];
}

const Objectives: React.FC<ObjectivesProps> = ({ objectives }) => {
  return (
    <div className="bg-stone/10 p-4 rounded-lg shadow-lg border-2 border-wood/20">
      <h3 className="text-xl font-bold mb-3 text-center border-b-2 border-wood/20 pb-2">Objectives</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {objectives.map(obj => (
          <li key={obj.id} className={`transition-all duration-300 ${obj.completed ? 'text-stone/50' : 'text-wood'}`}>
            <i className={`fas ${obj.completed ? 'fa-check-circle text-success' : 'fa-scroll'} w-6`}></i>
            <span className={obj.completed ? 'line-through' : ''}>{obj.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Objectives;
