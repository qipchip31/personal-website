"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createMineState,
  difficultyConfig,
  getRemainingMines,
  revealCell,
  toggleFlag,
  type Difficulty,
  type MineState,
} from "@/components/play/minesweeper/logic";

const fastestTimeStorageKey = "chirag.play.minesweeper.fastest";

type FastestTimes = Partial<Record<Difficulty, number>>;

function formatTime(seconds: number | undefined): string {
  if (seconds == null) {
    return "none";
  }

  return `${seconds}s`;
}

function getFastestTimes(): FastestTimes {
  if (typeof window === "undefined") {
    return {};
  }

  const value = window.localStorage.getItem(fastestTimeStorageKey);

  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as FastestTimes;
  } catch {
    return {};
  }
}

export function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [state, setState] = useState<MineState>(() =>
    createMineState("beginner"),
  );
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [fastestTimes, setFastestTimes] =
    useState<FastestTimes>(getFastestTimes);
  const config = difficultyConfig[difficulty];
  const remainingMines = useMemo(() => getRemainingMines(state), [state]);
  const fastestForDifficulty = fastestTimes[difficulty];
  const displayedFastest =
    state.won && fastestForDifficulty != null
      ? Math.min(fastestForDifficulty, elapsed)
      : state.won
        ? elapsed
        : fastestForDifficulty;

  useEffect(() => {
    if (!started || state.lost || state.won) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, state.lost, state.won]);

  useEffect(() => {
    if (!state.won) {
      return;
    }

    const best = fastestTimes[difficulty];

    if (best != null && best <= elapsed) {
      return;
    }

    const nextTimes = {
      ...fastestTimes,
      [difficulty]: elapsed,
    };

    window.localStorage.setItem(
      fastestTimeStorageKey,
      JSON.stringify(nextTimes),
    );
    const timer = window.setTimeout(() => {
      setFastestTimes(nextTimes);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [difficulty, elapsed, fastestTimes, state.won]);

  function restart(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty);
    setState(createMineState(nextDifficulty));
    setElapsed(0);
    setStarted(false);
  }

  function reveal(cellId: string) {
    setStarted(true);
    setState((current) => revealCell(current, cellId));
  }

  function flag(cellId: string) {
    setStarted(true);
    setState((current) => toggleFlag(current, cellId));
  }

  return (
    <div className="game-panel">
      <div className="game-toolbar" aria-label="minesweeper settings">
        <label>
          difficulty
          <select
            value={difficulty}
            onChange={(event) => restart(event.target.value as Difficulty)}
          >
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="expert">expert</option>
          </select>
        </label>
        <p>mines {remainingMines}</p>
        <p>time {elapsed}s</p>
        <p>best {formatTime(displayedFastest)}</p>
        <button type="button" onClick={() => restart()}>
          restart
        </button>
      </div>
      <p className="game-status" role="status">
        {state.won ? "cleared" : state.lost ? "mine hit" : "sweeping"}
      </p>
      <div className="mine-scroll">
        <div
          className="mine-board"
          role="grid"
          aria-label="minesweeper board"
          style={{
            gridTemplateColumns: `repeat(${config.width}, minmax(1.45rem, 1fr))`,
          }}
        >
          {state.cells.map((cell) => (
            <button
              aria-label={`${cell.x + 1}, ${cell.y + 1}${
                cell.flagged ? ", flagged" : ""
              }${cell.revealed ? ", revealed" : ""}`}
              className="mine-cell"
              data-adjacent={cell.revealed && !cell.mine ? cell.adjacent : 0}
              data-state={
                cell.revealed
                  ? cell.mine
                    ? "mine"
                    : "revealed"
                  : cell.flagged
                    ? "flagged"
                    : "hidden"
              }
              key={cell.id}
              onClick={() => reveal(cell.id)}
              onContextMenu={(event) => {
                event.preventDefault();
                flag(cell.id);
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault();
                  flag(cell.id);
                }
              }}
              role="gridcell"
              type="button"
            >
              {cell.revealed
                ? cell.mine
                  ? "*"
                  : cell.adjacent || ""
                : cell.flagged
                  ? "f"
                  : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
