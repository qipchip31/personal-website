import Link from "next/link";
import type { ReactNode } from "react";

type GameShellProps = {
  children: ReactNode;
  description: string;
  footer?: ReactNode;
  title: string;
};

export function GameShell({
  children,
  description,
  footer,
  title,
}: GameShellProps) {
  return (
    <section className="game-shell" aria-labelledby="game-title">
      <Link className="game-shell__back" href="/play">
        ← back to play
      </Link>
      <header className="game-shell__header">
        <h1 id="game-title">{title}</h1>
        <p>{description}</p>
      </header>
      <div className="game-shell__viewport">{children}</div>
      {footer ? <footer className="game-shell__footer">{footer}</footer> : null}
    </section>
  );
}
