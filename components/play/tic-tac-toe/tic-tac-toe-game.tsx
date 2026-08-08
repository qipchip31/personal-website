"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createBoard,
  getComputerMove,
  getWinner,
  type Board,
  type Difficulty,
  type Mode,
} from "@/components/play/tic-tac-toe/logic";

const difficultyStorageKey = "chirag.play.ticTacToe.difficulty";

function getInitialDifficulty(): Difficulty {
  if (typeof window === "undefined") {
    return "medium";
  }

  const storedDifficulty = window.localStorage.getItem(difficultyStorageKey);

  if (
    storedDifficulty === "easy" ||
    storedDifficulty === "medium" ||
    storedDifficulty === "hard"
  ) {
    return storedDifficulty;
  }

  return "medium";
}

function getStatus(board: Board, current: "o" | "x", mode: Mode): string {
  const winner = getWinner(board);

  if (winner === "draw") {
    return "draw";
  }

  if (winner) {
    return `${winner} wins`;
  }

  if (mode === "computer" && current === "o") {
    return "computer thinking";
  }

  return `${current} to move`;
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [current, setCurrent] = useState<"o" | "x">("x");
  const [mode, setMode] = useState<Mode>("computer");
  const [difficulty, setDifficulty] =
    useState<Difficulty>(getInitialDifficulty);
  const winner = useMemo(() => getWinner(board), [board]);

  useEffect(() => {
    window.localStorage.setItem(difficultyStorageKey, difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (mode !== "computer" || current !== "o" || winner) {
      return;
    }

    const timer = window.setTimeout(() => {
      const move = getComputerMove(board, difficulty);

      if (move < 0) {
        return;
      }

      setBoard((currentBoard) => {
        if (currentBoard[move] || getWinner(currentBoard)) {
          return currentBoard;
        }

        const nextBoard = [...currentBoard];
        nextBoard[move] = "o";

        return nextBoard;
      });
      setCurrent("x");
    }, 180);

    return () => window.clearTimeout(timer);
  }, [board, current, difficulty, mode, winner]);

  function restart() {
    setBoard(createBoard());
    setCurrent("x");
  }

  function playMove(index: number) {
    if (board[index] || winner || (mode === "computer" && current === "o")) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = current;
    setBoard(nextBoard);
    setCurrent(current === "x" ? "o" : "x");
  }

  return (
    <div className="game-panel">
      <div className="game-toolbar" aria-label="tic tac toe settings">
        <label>
          mode
          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              restart();
            }}
          >
            <option value="computer">vs computer</option>
            <option value="players">two players</option>
          </select>
        </label>
        <label>
          difficulty
          <select
            disabled={mode === "players"}
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as Difficulty)
            }
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </label>
        <button type="button" onClick={restart}>
          restart
        </button>
      </div>
      <p className="game-status" role="status">
        {getStatus(board, current, mode)}
      </p>
      <div className="tic-board" role="grid" aria-label="tic tac toe board">
        {board.map((cell, index) => (
          <button
            aria-label={`cell ${index + 1}${cell ? `, ${cell}` : ""}`}
            className="tic-cell"
            disabled={Boolean(cell) || Boolean(winner)}
            key={index}
            onClick={() => playMove(index)}
            role="gridcell"
            type="button"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
