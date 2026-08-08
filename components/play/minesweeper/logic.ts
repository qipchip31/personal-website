export type Difficulty = "beginner" | "expert" | "intermediate";

export type MineCell = {
  adjacent: number;
  flagged: boolean;
  id: string;
  mine: boolean;
  revealed: boolean;
  x: number;
  y: number;
};

export type MineConfig = {
  height: number;
  mines: number;
  width: number;
};

export type MineState = {
  cells: MineCell[];
  difficulty: Difficulty;
  lost: boolean;
  won: boolean;
};

export const difficultyConfig: Record<Difficulty, MineConfig> = {
  beginner: { height: 9, mines: 10, width: 9 },
  intermediate: { height: 16, mines: 40, width: 16 },
  expert: { height: 16, mines: 99, width: 30 },
};

function getCellId(x: number, y: number): string {
  return `${x}-${y}`;
}

function getNeighbors(cell: MineCell, cells: MineCell[]): MineCell[] {
  return cells.filter((candidate) => {
    if (candidate.id === cell.id) {
      return false;
    }

    return (
      Math.abs(candidate.x - cell.x) <= 1 && Math.abs(candidate.y - cell.y) <= 1
    );
  });
}

function placeMines(config: MineConfig): Set<string> {
  const mines = new Set<string>();

  while (mines.size < config.mines) {
    const x = Math.floor(Math.random() * config.width);
    const y = Math.floor(Math.random() * config.height);
    mines.add(getCellId(x, y));
  }

  return mines;
}

export function createMineState(difficulty: Difficulty): MineState {
  const config = difficultyConfig[difficulty];
  const mines = placeMines(config);
  const cells = Array.from(
    { length: config.height * config.width },
    (_, index) => {
      const x = index % config.width;
      const y = Math.floor(index / config.width);
      const id = getCellId(x, y);

      return {
        adjacent: 0,
        flagged: false,
        id,
        mine: mines.has(id),
        revealed: false,
        x,
        y,
      };
    },
  );

  return {
    cells: cells.map((cell) => ({
      ...cell,
      adjacent: getNeighbors(cell, cells).filter((neighbor) => neighbor.mine)
        .length,
    })),
    difficulty,
    lost: false,
    won: false,
  };
}

function hasWon(cells: MineCell[]): boolean {
  return cells.every((cell) => cell.mine || cell.revealed);
}

export function revealCell(state: MineState, cellId: string): MineState {
  if (state.lost || state.won) {
    return state;
  }

  const selected = state.cells.find((cell) => cell.id === cellId);

  if (!selected || selected.flagged || selected.revealed) {
    return state;
  }

  if (selected.mine) {
    return {
      ...state,
      cells: state.cells.map((cell) =>
        cell.mine ? { ...cell, revealed: true } : cell,
      ),
      lost: true,
    };
  }

  const revealed = new Set<string>();
  const queue = [selected];

  while (queue.length > 0) {
    const cell = queue.shift();

    if (!cell || revealed.has(cell.id) || cell.flagged) {
      continue;
    }

    revealed.add(cell.id);

    if (cell.adjacent === 0) {
      getNeighbors(cell, state.cells).forEach((neighbor) => {
        if (!neighbor.mine && !revealed.has(neighbor.id)) {
          queue.push(neighbor);
        }
      });
    }
  }

  const cells = state.cells.map((cell) =>
    revealed.has(cell.id) ? { ...cell, revealed: true } : cell,
  );

  return {
    ...state,
    cells,
    won: hasWon(cells),
  };
}

export function toggleFlag(state: MineState, cellId: string): MineState {
  if (state.lost || state.won) {
    return state;
  }

  const cell = state.cells.find((candidate) => candidate.id === cellId);

  if (!cell || cell.revealed) {
    return state;
  }

  return {
    ...state,
    cells: state.cells.map((candidate) =>
      candidate.id === cellId
        ? { ...candidate, flagged: !candidate.flagged }
        : candidate,
    ),
  };
}

export function getRemainingMines(state: MineState): number {
  const flags = state.cells.filter((cell) => cell.flagged).length;

  return difficultyConfig[state.difficulty].mines - flags;
}
