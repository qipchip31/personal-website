import type { ReactNode } from "react";

type FinderWindowProps = {
  title: string;
  children?: ReactNode;
};

export function FinderWindow({ title, children }: FinderWindowProps) {
  return (
    <section className="finder-window" aria-label={title}>
      <header className="finder-window__titlebar">
        <span className="finder-window__control" aria-hidden="true" />
        <span className="finder-window__title-rule" aria-hidden="true" />
        <h1 className="finder-window__title">{title}</h1>
        <span className="finder-window__title-rule" aria-hidden="true" />
        <span
          className="finder-window__control finder-window__control--right"
          aria-hidden="true"
        />
      </header>
      <div className="finder-window__body" tabIndex={0}>
        {children}
      </div>
    </section>
  );
}
