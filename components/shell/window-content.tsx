import type { ReactNode } from "react";

type WindowContentProps = {
  section: string;
  children?: ReactNode;
};

export function WindowContent({ section, children }: WindowContentProps) {
  return (
    <div className="window-content" aria-label={`${section} content area`}>
      {children}
    </div>
  );
}
