import type { Metadata } from "next";
import { GameShell } from "@/components/play/game-shell";
import { WordleGame } from "@/components/play/wordle/wordle-game";
import { Desktop } from "@/components/shell/desktop";
import { getGame } from "@/lib/play";

const game = getGame("wordle");

export const metadata: Metadata = {
  title: game.title,
  description: game.description,
};

export default function WordlePage() {
  return (
    <Desktop
      initialHref="/play"
      contentByHref={{
        "/play": (
          <GameShell title={game.title} description={game.description}>
            <WordleGame />
          </GameShell>
        ),
      }}
    />
  );
}
