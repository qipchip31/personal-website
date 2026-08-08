import type { Metadata } from "next";
import { GameShell } from "@/components/play/game-shell";
import { TicTacToeGame } from "@/components/play/tic-tac-toe/tic-tac-toe-game";
import { Desktop } from "@/components/shell/desktop";
import { getGame } from "@/lib/play";

const game = getGame("tic-tac-toe");

export const metadata: Metadata = {
  title: game.title,
  description: game.description,
};

export default function TicTacToePage() {
  return (
    <Desktop
      initialHref="/play"
      contentByHref={{
        "/play": (
          <GameShell title={game.title} description={game.description}>
            <TicTacToeGame />
          </GameShell>
        ),
      }}
    />
  );
}
