
import { GamePhase, GameObjective, GameState, WorldTile } from './types';

const initialWorld: WorldTile[] = Array(20).fill(null).map(() => ({
    wall: 0,
    building: null,
    units: [],
}));
initialWorld[2].building = "Farm";
initialWorld[8].building = "Farm";


export const INITIAL_GAME_STATE: GameState = {
    coins: 10,
    day: 1,
    phase: GamePhase.Player,
    playerPos: 10,
    actionsLeft: 2,
    peasants: 0,
    world: initialWorld,
    crownPos: 10,
    enemies: [],
    enemiesDefeated: 0,
    coinsEarned: 0,
    farmsBuilt: 2,
    wallsBuilt: 0,
    peasantsRecruited: 0,
    archersTrained: 0,
    eventLog: ["Your reign begins. Protect the crown!"],
};

export const OBJECTIVES: GameObjective[] = [
    { id: "build_farm_1", text: "Build 3 farms.", type: "build_count", target: "farmsBuilt", value: 3, completed: false, reward_type: "coins", reward_value: 5 },
    { id: "build_wall_1", text: "Build a wall.", type: "build_count", target: "wallsBuilt", value: 1, completed: false, reward_type: "coins", reward_value: 5 },
    { id: "recruit_peasant_1", text: "Recruit 1 peasant.", type: "build_count", target: "peasantsRecruited", value: 1, completed: false, reward_type: "coins", reward_value: 5 },
    { id: "train_archer_1", text: "Train an archer.", type: "build_count", target: "archersTrained", value: 1, completed: false, reward_type: "coins", reward_value: 10 },
    { id: "survive_3_days", text: "Survive 3 days.", type: "survive_days", target: "day", value: 3, completed: false, reward_type: "coins", reward_value: 10 },
    { id: "defeat_1_greed", text: "Defeat 1 Greed.", type: "defeat", target: "enemiesDefeated", value: 1, completed: false, reward_type: "coins", reward_value: 5 },
];
