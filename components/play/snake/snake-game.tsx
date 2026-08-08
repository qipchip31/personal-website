"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  boardSize,
  createSnakeState,
  getDirectionFromKey,
  stepSnake,
  type Direction,
  type SnakeState,
} from "@/components/play/snake/logic";

const bestScoreStorageKey = "chirag.play.snake.bestScore";

function getInitialBestScore(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const storedScore = Number(window.localStorage.getItem(bestScoreStorageKey));

  return Number.isFinite(storedScore) ? storedScore : 0;
}

function isSnakeCell(state: SnakeState, x: number, y: number): boolean {
  return state.snake.some((segment) => segment.x === x && segment.y === y);
}

export function SnakeGame() {
  const [state, setState] = useState<SnakeState>(() => createSnakeState());
  const [direction, setDirection] = useState<Direction>("right");
  const [paused, setPaused] = useState(true);
  const [bestScore, setBestScore] = useState(getInitialBestScore);
  const directionRef = useRef<Direction>("right");

  const cells = useMemo(
    () =>
      Array.from({ length: boardSize * boardSize }, (_, index) => ({
        x: index % boardSize,
        y: Math.floor(index / boardSize),
      })),
    [],
  );

  useEffect(() => {
    if (state.score > bestScore) {
      window.localStorage.setItem(bestScoreStorageKey, String(state.score));
      const timer = window.setTimeout(() => {
        setBestScore(state.score);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [bestScore, state.score]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const nextDirection = getDirectionFromKey(event.key.toLowerCase());

      if (nextDirection) {
        event.preventDefault();
        directionRef.current = nextDirection;
        setDirection(nextDirection);
        setPaused(false);
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        setPaused((current) => !current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (paused || state.over) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((currentState) => {
        const nextState = stepSnake(currentState, directionRef.current);
        setDirection(nextState.direction);

        return nextState;
      });
    }, 135);

    return () => window.clearInterval(timer);
  }, [paused, state.over]);

  function restart() {
    const nextState = createSnakeState();

    directionRef.current = nextState.direction;
    setDirection(nextState.direction);
    setState(nextState);
    setPaused(false);
  }

  function turn(nextDirection: Direction) {
    directionRef.current = nextDirection;
    setDirection(nextDirection);
    setPaused(false);
  }

  return (
    <div className="game-panel">
      <div className="game-toolbar" aria-label="snake controls">
        <p>score {state.score}</p>
        <p>best {Math.max(bestScore, state.score)}</p>
        <button type="button" onClick={() => setPaused((current) => !current)}>
          {paused ? "start" : "pause"}
        </button>
        <button type="button" onClick={restart}>
          restart
        </button>
      </div>
      <p className="game-status" role="status">
        {state.over ? "game over" : paused ? "paused" : `${direction}`}
      </p>
      <div className="snake-layout">
        <div className="snake-board" aria-label="snake board" role="grid">
          {cells.map(({ x, y }) => {
            const isHead = state.snake[0]?.x === x && state.snake[0]?.y === y;
            const isBody = !isHead && isSnakeCell(state, x, y);
            const isFood = state.food.x === x && state.food.y === y;

            return (
              <span
                aria-label={
                  isHead
                    ? "snake head"
                    : isBody
                      ? "snake body"
                      : isFood
                        ? "food"
                        : "empty"
                }
                className="snake-cell"
                data-cell={
                  isHead ? "head" : isBody ? "body" : isFood ? "food" : "empty"
                }
                key={`${x}-${y}`}
                role="gridcell"
              />
            );
          })}
        </div>
        <div className="snake-pad" aria-label="snake direction controls">
          <button type="button" onClick={() => turn("up")}>
            up
          </button>
          <button type="button" onClick={() => turn("left")}>
            left
          </button>
          <button type="button" onClick={() => turn("down")}>
            down
          </button>
          <button type="button" onClick={() => turn("right")}>
            right
          </button>
        </div>
      </div>
    </div>
  );
}
