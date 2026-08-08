export type Direction = "down" | "left" | "right" | "up";

export type Point = {
  x: number;
  y: number;
};

export type SnakeState = {
  direction: Direction;
  food: Point;
  over: boolean;
  score: number;
  snake: Point[];
};

export const boardSize = 16;

const oppositeDirections: Record<Direction, Direction> = {
  down: "up",
  left: "right",
  right: "left",
  up: "down",
};

const directionDeltas: Record<Direction, Point> = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
};

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function createFood(snake: Point[]): Point {
  const emptyCells: Point[] = [];

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const point = { x, y };

      if (!snake.some((segment) => pointsEqual(segment, point))) {
        emptyCells.push(point);
      }
    }
  }

  return (
    emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? { x: 0, y: 0 }
  );
}

export function createSnakeState(): SnakeState {
  const snake = [
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 },
  ];

  return {
    direction: "right",
    food: createFood(snake),
    over: false,
    score: 0,
    snake,
  };
}

export function canTurn(current: Direction, next: Direction): boolean {
  return oppositeDirections[current] !== next;
}

export function stepSnake(
  state: SnakeState,
  nextDirection: Direction,
): SnakeState {
  if (state.over) {
    return state;
  }

  const direction = canTurn(state.direction, nextDirection)
    ? nextDirection
    : state.direction;
  const head = state.snake[0];
  const delta = directionDeltas[direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= boardSize ||
    nextHead.y < 0 ||
    nextHead.y >= boardSize;
  const hitSelf = state.snake.some((segment) => pointsEqual(segment, nextHead));

  if (hitWall || hitSelf) {
    return {
      ...state,
      direction,
      over: true,
    };
  }

  const ateFood = pointsEqual(nextHead, state.food);
  const snake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];

  return {
    direction,
    food: ateFood ? createFood(snake) : state.food,
    over: false,
    score: ateFood ? state.score + 1 : state.score,
    snake,
  };
}

export function getDirectionFromKey(key: string): Direction | null {
  if (key === "arrowup" || key === "w") {
    return "up";
  }

  if (key === "arrowdown" || key === "s") {
    return "down";
  }

  if (key === "arrowleft" || key === "a") {
    return "left";
  }

  if (key === "arrowright" || key === "d") {
    return "right";
  }

  return null;
}
