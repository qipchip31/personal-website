"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
  caption?: string;
};

export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const id = useId().replaceAll(":", "");
  const mounted = useRef(false);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (mounted.current) {
      return;
    }

    mounted.current = true;
    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            background: "#fcfcf9",
            primaryColor: "#ffffff",
            primaryTextColor: "#11110f",
            primaryBorderColor: "#11110f",
            lineColor: "#6f6f69",
            fontFamily: "geneva, sans-serif",
          },
        });

        return mermaid.render(`mermaid-${id}`, chart);
      })
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSvg("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <figure className="mdx-mermaid">
      <div
        className="mdx-mermaid__frame"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      >
        {svg ? null : <pre>{chart}</pre>}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
