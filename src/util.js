import { timeLimitMinutes } from './index.js';

export const traverseTree = (
  frontier,
  sortFunction = () => 0,
  iterativeDfs = false,
  startingTime,
  depthLimit
) => {
  !iterativeDfs && console.time('Time Spent');
  let numOfExpandedNodes = 0;
  let bestSolutionSoFar = frontier[0];
  let prevTime = Date.now();
  let maxNodesInFrontier = 0;

  if (iterativeDfs) prevTime = startingTime;

  while (true) {
    if (frontier.length > maxNodesInFrontier) {
      maxNodesInFrontier = frontier.length;
    }
    const exploredNode = frontier.remove();
    numOfExpandedNodes++;
    let childrenStates = [];

    if (iterativeDfs && exploredNode == undefined) break;

    if (
      exploredNode.isGameOver() &&
      exploredNode.depth >= bestSolutionSoFar.depth
    ) {
      bestSolutionSoFar = exploredNode;
    }

    if (
      exploredNode.isOptimal() ||
      Date.now() - prevTime >= timeLimitMinutes * 60 * 1000
    ) {
      break;
    }

    if (!iterativeDfs || exploredNode.depth < depthLimit)
      childrenStates = exploredNode.getChildrenStates();

    childrenStates.sort(sortFunction); //Sort the children nodes according to given sort function
    childrenStates.forEach((child) => {
      frontier.add(child);
    });
  }
  if (!iterativeDfs) {
    console.timeEnd('Time Spent');
    printPath(bestSolutionSoFar, numOfExpandedNodes, maxNodesInFrontier);
  } else {
    return [bestSolutionSoFar, numOfExpandedNodes, maxNodesInFrontier];
  }
};

export const printPath = (
  finalNode,
  numOfExpandedNodes,
  maxNodesInFrontier
) => {
  let iter = finalNode;
  const nodes = [];
  while (iter !== null) {
    nodes.push(iter);
    iter = iter.parent;
  }

  if (finalNode.depth === 0) {
    console.log('Message: No Solutions Found! (Time Limit Reached)');
    return;
  }

  if (finalNode.isOptimal()) {
    console.log('Message: Optimum Solution Found!!');
  } else {
    const remainingPegs = finalNode.getNumOfRemainingPegs();
    console.log(
      `Message: Sub-optimum Solution Found With ${remainingPegs} Remaining Pegs`
    );
  }

  console.log('Expanded Nodes: ', numOfExpandedNodes);
  console.log('Max Number of Nodes Stored in Memory:', maxNodesInFrontier);
  console.log('\n=== Board States Until the Solution. ===');

  nodes.reverse().forEach((node, i) => {
    const lastMove = nodes[i + 1]?.move || [];
    const lastRemoved = nodes[i + 1]?.removedPeg || [];
    console.log(node.toString(lastMove, lastRemoved), '\n');
  });
};

export const euclideanDistance = (x1, y1, x2, y2) => {
  const a = x1 - x2;
  const b = y1 - y2;

  return Math.sqrt(a * a + b * b);
};
