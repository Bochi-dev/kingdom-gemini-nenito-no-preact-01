
export enum GamePhase {
  Player = "Player Phase",
  Build = "Build Phase",
  Enemy = "Enemy Phase",
  Income = "Income Phase",
}

export interface WorldTile {
  wall: number;
  building: string | null;
  units: string[];
}

export interface Enemy {
  pos: number;
  hp: number;
}

export interface GameObjective {
  id: string;
  text: string;
  type: string;
  target: string;
  value: number;
  completed: boolean;
  reward_type: string;
  reward_value: number;
}

export interface GameState {
  coins: number;
  day: number;
  phase: GamePhase;
  playerPos: number;
  actionsLeft: number;
  peasants: number;
  world: WorldTile[];
  crownPos: number;
  enemies: Enemy[];
  enemiesDefeated: number;
  coinsEarned: number;
  farmsBuilt: number;
  wallsBuilt: number;
  peasantsRecruited: number;
  archersTrained: number;
  eventLog: string[];
}
