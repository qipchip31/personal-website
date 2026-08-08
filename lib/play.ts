export type GameSlug = "minesweeper" | "snake" | "tic-tac-toe";

export type GameMetadata = {
  title: string;
  description: string;
  href: `/play/${GameSlug}`;
  slug: GameSlug;
};

export const games = [
  {
    title: "tic tac toe",
    description: "a quiet grid for two players or a small computer opponent.",
    href: "/play/tic-tac-toe",
    slug: "tic-tac-toe",
  },
  {
    title: "snake",
    description: "guide the line, eat the marks, avoid yourself.",
    href: "/play/snake",
    slug: "snake",
  },
  {
    title: "minesweeper",
    description: "clear the field with flags, numbers, and patience.",
    href: "/play/minesweeper",
    slug: "minesweeper",
  },
] as const satisfies GameMetadata[];

export function getGame(slug: GameSlug): GameMetadata {
  const game = games.find((item) => item.slug === slug);

  if (!game) {
    throw new Error(`unknown game: ${slug}`);
  }

  return game;
}
