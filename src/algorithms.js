import { timeLimitMinutes } from './index.js';
import { traverseTree, printPath } from './util.js';

export const DFS = (rootNode) => {
  const frontier = [rootNode];
  frontier.add = frontier.push;
  frontier.remove = frontier.pop;

  const sortFunction = (a, b) => b.getRemovedPeg() - a.getRemovedPeg();
  traverseTree(frontier, sortFunction);
};

export const BFS = (rootNode) => {
  const frontier = [rootNode];
  frontier.add = frontier.push;
  frontier.remove = frontier.shift;

  const sortFunction = (a, b) => a.getRemovedPeg() - b.getRemovedPeg();
  traverseTree(frontier, sortFunction);
};

export const randomDFS = (rootNode) => {
  const frontier = [rootNode];
  frontier.add = frontier.push;
  frontier.remove = frontier.pop;

  const sortFunction = (a, b) => Math.random() - 0.5; //It sorts randomly (shuffles)
  traverseTree(frontier, sortFunction);
};

export const heuristicDFS = (rootNode) => {
  const frontier = [rootNode];
  frontier.add = frontier.push;
  frontier.remove = frontier.pop;

  const sortFunction = (a, b) => {
    if (b.getChildrenCount() < a.getChildrenCount()) {
      //First, choose the node which yields more childs
      return 1;
    }
    if (b.getChildrenCount() > a.getChildrenCount()) {
      return -1;
    }

    return b.getWeightedScore() - a.getWeightedScore(); //If equal, then choose the one which has least weighted score
  };
  traverseTree(frontier, sortFunction);
};

export const IDS = (rootNode) => {
  let frontier = [rootNode];
  frontier.add = frontier.push;
  frontier.remove = frontier.pop;
  let finalNode = null,
    numOfExpandedNodes = 0,
    maxNodesInFrontier = 0,
    depthLimit = 0;
  const sortFunction = (a, b) => b.getRemovedPeg() - a.getRemovedPeg();
  const startingTime = Date.now();

  console.time('Time Spent');
  while (true) {
    let currentSolutionNode = null,
      currentNumOfExpandedNodes = 0,
      currentMaxNodesInFrontier = 0;
    [
      currentSolutionNode,
      currentNumOfExpandedNodes,
      currentMaxNodesInFrontier,
    ] = traverseTree(frontier, sortFunction, true, startingTime, depthLimit);

    if (currentSolutionNode != null && finalNode == null) {
      finalNode = currentSolutionNode;
    }
    if (finalNode != null && currentSolutionNode.depth > finalNode.depth) {
      finalNode = currentSolutionNode;
    }
    if (currentMaxNodesInFrontier > maxNodesInFrontier) {
      maxNodesInFrontier = currentMaxNodesInFrontier;
    }

    numOfExpandedNodes += currentNumOfExpandedNodes;

    frontier = [rootNode];
    frontier.add = frontier.push;
    frontier.remove = frontier.pop;
    depthLimit++;
    if (
      Date.now() - startingTime >= timeLimitMinutes * 60 * 1000 ||
      finalNode.isOptimal()
    )
      break;
  }
  console.timeEnd('Time Spent');
  printPath(finalNode, numOfExpandedNodes, maxNodesInFrontier);
};
