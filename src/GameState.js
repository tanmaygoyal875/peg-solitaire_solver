import chalk from 'chalk';
import { euclideanDistance } from './util.js';
import config from './config.js';

export default class GameState {
  constructor(board, move = [], removedPeg = [], parent = null, depth = 0) {
    this.board = board; //Board represented by 2d array
    this.move = move; //Move which leads to this state [fromLabel, destLabel]
    this.removedPeg = removedPeg; //Last removed peg before this state
    this.parent = parent; //Immediate parent of this current state.
    this.depth = depth; //Depth of this state in the tree
  }

  //Takes row and column and returns the label of the slot
  getSlotLabel(row, col) {
    if (this.board[row]?.[col] === -1) {
      return -1;
    }

    let sum = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] !== -1) {
          sum++;
        }
        if (i === row && j === col) {
          return sum;
        }
      }
    }
    return sum;
  }

  //Inverse of getSlotLabel
  getCoordinate(slotLabel) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.getSlotLabel(i, j) === slotLabel) {
          return [i, j];
        }
      }
    }
  }

  //Calculates the weighted score for the board (Sum of all euclidean distances from each peg to the center peg)
  getWeightedScore() {
    let score = 0;

    const iMiddle = Math.floor(this.board.length / 2);
    const jMiddle = Math.floor(this.board[0].length / 2);

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] == 1) {
          score += euclideanDistance(i, j, iMiddle, jMiddle);
        }
      }
    }
    return score;
  }

  //Returns the remaining pegs
  getNumOfRemainingPegs() {
    let remainingPegs = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 1) {
          remainingPegs++;
        }
      }
    }
    return remainingPegs;
  }

  //Yields a string representation of given move array
  getMoveString(move = this.move) {
    return `${move[0]} => ${move[1]}`;
  }

  getChildrenCount() {
    return this.getChildrenStates().length;
  }

  isGameOver() {
    return this.getChildrenCount() === 0;
  }
  //Whether current board is identical to the goal state
  isOptimal() {
    return JSON.stringify(this.board) === JSON.stringify(config.goalState);
  }

  /*Takes an array of children nodes and a peg position and the direction
  of the move. And pushes the new gameState instance to the array if there 
  is a valid move in the given direction*/
  addChildState(childrenStates, i, j, iDirection, jDirection) {
    if (
      this.board[i][j] === 1 &&
      this.board[i + iDirection]?.[j + jDirection] === 1 &&
      this.board[i + iDirection * 2]?.[j + jDirection * 2] === 0
    ) {
      const newState = this.board.map((row) => row.slice());
      newState[i][j] = 0;
      newState[i + iDirection][j + jDirection] = 0;
      newState[i + iDirection * 2][j + jDirection * 2] = 1;

      const move = [
        this.getSlotLabel(i, j),
        this.getSlotLabel(i + 2 * iDirection, j + 2 * jDirection),
      ];

      const removedPeg = [i + iDirection, j + jDirection];

      childrenStates.push(
        new GameState(newState, move, removedPeg, this, this.depth + 1)
      );
    }
  }
  //Returns the slotLabel of the removedPeg using its coordinates
  getRemovedPeg() {
    return this.getSlotLabel(this.removedPeg[0], this.removedPeg[1]);
  }
  //Returns the array which contains all children states of current gameState instance
  getChildrenStates() {
    const childrenStates = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const directions = [
          [-1, 0],
          [1, 0],
          [0, 1],
          [0, -1],
        ];
        directions.forEach((dir) =>
          this.addChildState(childrenStates, i, j, dir[0], dir[1])
        );
      }
    }
    return childrenStates;
  }
  //Returns the string representation of current gamestate
  toString(nextMove, nextRemoved) {
    let string =
      nextMove.length > 0
        ? `\nMove #${this.depth + 1}: ${this.getMoveString(nextMove)}\n\n`
        : '\n';

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const value = this.board[i][j];
        if (this.isGameOver() && value === 1) {
          string += chalk.blue(value);
        } else if (nextMove.indexOf(this.getSlotLabel(i, j)) !== -1) {
          string += chalk.green(value);
        } else if (nextRemoved[0] === i && nextRemoved[1] === j) {
          string += chalk.red(value);
        } else if (value === -1) {
          string += ' ';
        } else {
          string += value;
        }
        string += ' ';
      }
      string += '\n';
    }

    return string;
  }
}
