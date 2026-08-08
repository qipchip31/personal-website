type AboutThisMacProps = {
  open: boolean;
  onClose: () => void;
};

const specs = [
  ["processor", "coffee"],
  ["memory", "not enough"],
  ["storage", "mostly markdown"],
  ["uptime", "since 2026"],
  ["current mood", "building things"],
] as const;

export function AboutThisMac({ open, onClose }: AboutThisMacProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="mac-dialog-backdrop" role="presentation">
      <section
        className="mac-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-this-mac-title"
      >
        <h2 id="about-this-mac-title">about this mac</h2>
        <p className="mac-dialog__name">chirag os</p>
        <p className="mac-dialog__version">version 1.0</p>
        <dl>
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={onClose} autoFocus>
          close
        </button>
      </section>
    </div>
  );
}
