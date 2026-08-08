import type { Metadata } from "next";
import Link from "next/link";
import { Desktop } from "@/components/shell/desktop";
import { games } from "@/lib/play";

export const metadata: Metadata = {
  title: "play",
  description: "small browser games by chirag pradhan.",
};

function PlayFolder() {
  return (
    <section className="play-index" aria-label="play">
      <p className="play-index__label">play</p>
      <ol className="play-list">
        {games.map((game) => (
          <li className="play-item" key={game.slug}>
            <article>
              <h2>
                <Link href={game.href}>{game.title}</Link>
              </h2>
              <p>{game.description}</p>
              <Link className="play-item__open" href={game.href}>
                open →
              </Link>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function PlayPage() {
  return (
    <Desktop
      initialHref="/play"
      contentByHref={{
        "/play": <PlayFolder />,
      }}
    />
  );
}
