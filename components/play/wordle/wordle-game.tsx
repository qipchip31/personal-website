"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addLetter,
  createWordleState,
  evaluateGuess,
  getKeyResults,
  getShareText,
  isLetter,
  keyboardRows,
  maxGuesses,
  removeLetter,
  submitGuess,
  wordLength,
  type LetterResult,
  type WordleState,
} from "@/components/play/wordle/logic";

function getCellResult(
  state: WordleState,
  rowIndex: number,
  columnIndex: number,
): LetterResult {
  const guess = state.guesses[rowIndex];

  if (!guess) {
    return "empty";
  }

  return evaluateGuess(guess, state.target)[columnIndex];
}

function getCellLetter(
  state: WordleState,
  rowIndex: number,
  columnIndex: number,
): string {
  const guess = state.guesses[rowIndex];

  if (guess) {
    return guess[columnIndex] ?? "";
  }

  if (rowIndex === state.guesses.length && state.status === "playing") {
    return state.currentGuess[columnIndex] ?? "";
  }

  return "";
}

export function WordleGame() {
  const [state, setState] = useState<WordleState>(() => createWordleState());
  const rows = useMemo(
    () => Array.from({ length: maxGuesses }, (_, index) => index),
    [],
  );
  const columns = useMemo(
    () => Array.from({ length: wordLength }, (_, index) => index),
    [],
  );
  const keyResults = getKeyResults(state);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (isLetter(key)) {
        event.preventDefault();
        setState((current) => addLetter(current, key));
        return;
      }

      if (key === "backspace") {
        event.preventDefault();
        setState(removeLetter);
        return;
      }

      if (key === "enter") {
        event.preventDefault();
        setState(submitGuess);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function restart() {
    setState(createWordleState());
  }

  function pressKey(key: string) {
    setState((current) => addLetter(current, key));
  }

  async function shareResult() {
    if (state.guesses.length === 0) {
      setState((current) => ({
        ...current,
        message: "make a guess first",
      }));
      return;
    }

    const text = getShareText(state, window.location.href);

    try {
      if (navigator.share) {
        await navigator.share({ text });
        setState((current) => ({
          ...current,
          message: "shared",
        }));
        return;
      }

      await navigator.clipboard.writeText(text);
      setState((current) => ({
        ...current,
        message: "copied",
      }));
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setState((current) => ({
          ...current,
          message: "copied",
        }));
      } catch {
        setState((current) => ({
          ...current,
          message: "could not share",
        }));
      }
    }
  }

  return (
    <div className="game-panel wordle-game">
      <div className="game-toolbar" aria-label="wordle controls">
        <p>guess {Math.min(state.guesses.length + 1, maxGuesses)} of 6</p>
        <button type="button" onClick={shareResult}>
          share
        </button>
        <button type="button" onClick={restart}>
          restart
        </button>
      </div>
      <p className="game-status" role="status">
        {state.message}
      </p>
      <div className="wordle-board" aria-label="wordle board" role="grid">
        {rows.map((rowIndex) => (
          <div className="wordle-row" key={rowIndex} role="row">
            {columns.map((columnIndex) => {
              const letter = getCellLetter(state, rowIndex, columnIndex);
              const result = getCellResult(state, rowIndex, columnIndex);

              return (
                <span
                  aria-label={letter ? `${letter} ${result}` : "empty"}
                  className="wordle-cell"
                  data-state={letter ? result : "empty"}
                  key={`${rowIndex}-${columnIndex}`}
                  role="gridcell"
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="wordle-keyboard" aria-label="wordle keyboard">
        {keyboardRows.map((row) => (
          <div className="wordle-keyboard__row" key={row}>
            {Array.from(row).map((key) => (
              <button
                className="wordle-key"
                data-state={keyResults[key] ?? "empty"}
                key={key}
                onClick={() => pressKey(key)}
                type="button"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="wordle-keyboard__row">
          <button
            className="wordle-key wordle-key--wide"
            onClick={() => setState(submitGuess)}
            type="button"
          >
            enter
          </button>
          <button
            className="wordle-key wordle-key--wide"
            onClick={() => setState(removeLetter)}
            type="button"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}
