import Link from "next/link";
import { Desktop } from "@/components/shell/desktop";

function NotFoundPanel() {
  return (
    <section className="finder-message" aria-label="not found">
      <p>this note is not in the drawer.</p>
      <Link href="/work">← back to work</Link>
    </section>
  );
}

export default function NotFound() {
  return (
    <Desktop
      initialHref="/work"
      contentByHref={{
        "/work": <NotFoundPanel />,
      }}
    />
  );
}
