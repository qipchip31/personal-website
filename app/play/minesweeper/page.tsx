import type { Metadata } from "next";
import { MinesweeperGame } from "@/components/play/minesweeper/minesweeper-game";
import { GameShell } from "@/components/play/game-shell";
import { Desktop } from "@/components/shell/desktop";
import { getGame } from "@/lib/play";

const game = getGame("minesweeper");

export const metadata: Metadata = {
  title: game.title,
  description: game.description,
};

export default function MinesweeperPage() {
  return (
    <Desktop
      initialHref="/play"
      contentByHref={{
        "/play": (
          <GameShell title={game.title} description={game.description}>
            <MinesweeperGame />
          </GameShell>
        ),
      }}
    />
  );
}
