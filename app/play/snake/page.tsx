import type { Metadata } from "next";
import { GameShell } from "@/components/play/game-shell";
import { SnakeGame } from "@/components/play/snake/snake-game";
import { Desktop } from "@/components/shell/desktop";
import { getGame } from "@/lib/play";

const game = getGame("snake");

export const metadata: Metadata = {
  title: game.title,
  description: game.description,
};

export default function SnakePage() {
  return (
    <Desktop
      initialHref="/play"
      contentByHref={{
        "/play": (
          <GameShell title={game.title} description={game.description}>
            <SnakeGame />
          </GameShell>
        ),
      }}
    />
  );
}
