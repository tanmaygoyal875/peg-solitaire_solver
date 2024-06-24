import { DFS, BFS, randomDFS, heuristicDFS, IDS } from './algorithms.js';
import config from './config.js';
import GameState from './GameState.js';
import promptSync from 'prompt-sync';
const prompt = promptSync();

const initialGameState = new GameState(config.initialState);

const algorithms = {
  1: BFS,
  2: DFS,
  3: IDS,
  4: randomDFS,
  5: heuristicDFS,
};

console.log(`\n\n
Choose algorithm:
1 - Breadth-First Search
2 - Depth-First Search
3 - Iterative Deepening Search
4 - Depth-First Search With Random Selection
5 - Depth-First Search With a Node Selection Heuristic\n`);

const algorithm = prompt('Choose 1-5: ');
export const timeLimitMinutes = prompt('Enter Time Limit in Minutes: ');

console.log('\n\n\n================================================\n');
console.log('\nAlgorithm: ', algorithms[algorithm].name);
algorithms[algorithm](initialGameState);
