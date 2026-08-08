export type Mark = "o" | "x";
export type Cell = Mark | null;
export type Board = Cell[];
export type Mode = "computer" | "players";
export type Difficulty = "easy" | "hard" | "medium";
export type Winner = Mark | "draw" | null;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function createBoard(): Board {
  return Array<Cell>(9).fill(null);
}

export function getWinner(board: Board): Winner {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(Boolean) ? "draw" : null;
}

export function getAvailableMoves(board: Board): number[] {
  return board.flatMap((cell, index) => (cell ? [] : [index]));
}

function scoreBoard(board: Board, depth: number): number {
  const winner = getWinner(board);

  if (winner === "o") {
    return 10 - depth;
  }

  if (winner === "x") {
    return depth - 10;
  }

  return 0;
}

function minimax(board: Board, mark: Mark, depth: number): number {
  const winner = getWinner(board);

  if (winner) {
    return scoreBoard(board, depth);
  }

  const scores = getAvailableMoves(board).map((move) => {
    const nextBoard = [...board];
    nextBoard[move] = mark;

    return minimax(nextBoard, mark === "o" ? "x" : "o", depth + 1);
  });

  return mark === "o" ? Math.max(...scores) : Math.min(...scores);
}

function findBestMove(board: Board): number {
  const scoredMoves = getAvailableMoves(board).map((move) => {
    const nextBoard = [...board];
    nextBoard[move] = "o";

    return {
      move,
      score: minimax(nextBoard, "x", 0),
    };
  });

  return scoredMoves.sort((a, b) => b.score - a.score)[0]?.move ?? -1;
}

function findRandomMove(board: Board): number {
  const moves = getAvailableMoves(board);

  return moves[Math.floor(Math.random() * moves.length)] ?? -1;
}

function findMediumMove(board: Board): number {
  const bestMove = findBestMove(board);

  if (Math.random() < 0.65) {
    return bestMove;
  }

  return findRandomMove(board);
}

export function getComputerMove(board: Board, difficulty: Difficulty): number {
  if (difficulty === "easy") {
    return findRandomMove(board);
  }

  if (difficulty === "medium") {
    return findMediumMove(board);
  }

  return findBestMove(board);
}
