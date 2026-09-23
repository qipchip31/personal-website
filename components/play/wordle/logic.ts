export type LetterResult = "absent" | "correct" | "empty" | "present";
export type GameStatus = "lost" | "playing" | "won";

export type WordleState = {
  currentGuess: string;
  guesses: string[];
  message: string;
  status: GameStatus;
  target: string;
};

export const wordLength = 5;
export const maxGuesses = 6;

export const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

const targetWords = [
  "agent",
  "array",
  "audit",
  "batch",
  "cache",
  "cable",
  "cloud",
  "debug",
  "delta",
  "drive",
  "fault",
  "field",
  "graph",
  "index",
  "input",
  "layer",
  "logic",
  "model",
  "patch",
  "pixel",
  "proxy",
  "query",
  "queue",
  "route",
  "scale",
  "scope",
  "stack",
  "state",
  "token",
  "trace",
  "train",
  "value",
  "vector",
  "watch",
];

function getRandomTarget(): string {
  return targetWords[Math.floor(Math.random() * targetWords.length)] ?? "logic";
}

export function createWordleState(): WordleState {
  return {
    currentGuess: "",
    guesses: [],
    message: "type a word",
    status: "playing",
    target: getRandomTarget(),
  };
}

export function isLetter(value: string): boolean {
  return /^[a-z]$/.test(value);
}

export function evaluateGuess(guess: string, target: string): LetterResult[] {
  const result = Array<LetterResult>(wordLength).fill("absent");
  const remainingLetters = new Map<string, number>();

  for (let index = 0; index < wordLength; index += 1) {
    const guessLetter = guess[index];
    const targetLetter = target[index];

    if (guessLetter === targetLetter) {
      result[index] = "correct";
      continue;
    }

    remainingLetters.set(
      targetLetter,
      (remainingLetters.get(targetLetter) ?? 0) + 1,
    );
  }

  for (let index = 0; index < wordLength; index += 1) {
    if (result[index] === "correct") {
      continue;
    }

    const guessLetter = guess[index];
    const remainingCount = remainingLetters.get(guessLetter) ?? 0;

    if (remainingCount > 0) {
      result[index] = "present";
      remainingLetters.set(guessLetter, remainingCount - 1);
    }
  }

  return result;
}

export function getKeyResults(
  state: WordleState,
): Record<string, LetterResult> {
  const priority: Record<LetterResult, number> = {
    empty: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };
  const keyResults: Record<string, LetterResult> = {};

  for (const guess of state.guesses) {
    const results = evaluateGuess(guess, state.target);

    for (let index = 0; index < guess.length; index += 1) {
      const letter = guess[index];
      const result = results[index];
      const current = keyResults[letter] ?? "empty";

      if (priority[result] > priority[current]) {
        keyResults[letter] = result;
      }
    }
  }

  return keyResults;
}

function getShareMark(result: LetterResult): string {
  if (result === "correct") {
    return "🟩";
  }

  if (result === "present") {
    return "🟨";
  }

  return "⬛";
}

export function getShareText(state: WordleState, url: string): string {
  const score =
    state.status === "won" ? String(state.guesses.length) : state.status;
  const grid = state.guesses
    .map((guess) =>
      evaluateGuess(guess, state.target).map(getShareMark).join(""),
    )
    .join("\n");

  return [`wordle ${score}/${maxGuesses}`, grid, url]
    .filter(Boolean)
    .join("\n");
}

export function addLetter(state: WordleState, letter: string): WordleState {
  if (state.status !== "playing" || state.currentGuess.length >= wordLength) {
    return state;
  }

  return {
    ...state,
    currentGuess: `${state.currentGuess}${letter}`,
    message: "type a word",
  };
}

export function removeLetter(state: WordleState): WordleState {
  if (state.status !== "playing") {
    return state;
  }

  return {
    ...state,
    currentGuess: state.currentGuess.slice(0, -1),
    message: "type a word",
  };
}

export function submitGuess(state: WordleState): WordleState {
  if (state.status !== "playing") {
    return state;
  }

  if (state.currentGuess.length !== wordLength) {
    return {
      ...state,
      message: "need five letters",
    };
  }

  const guesses = [...state.guesses, state.currentGuess];

  if (state.currentGuess === state.target) {
    return {
      ...state,
      currentGuess: "",
      guesses,
      message: "solved",
      status: "won",
    };
  }

  if (guesses.length >= maxGuesses) {
    return {
      ...state,
      currentGuess: "",
      guesses,
      message: `answer was ${state.target}`,
      status: "lost",
    };
  }

  return {
    ...state,
    currentGuess: "",
    guesses,
    message: "keep going",
  };
}
