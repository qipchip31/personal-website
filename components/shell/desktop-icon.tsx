type DesktopIconProps = {
  label: string;
  "aria-label"?: string;
};

export function DesktopIcon({
  label,
  "aria-label": ariaLabel,
}: DesktopIconProps) {
  return (
    <button
      className="desktop-icon"
      type="button"
      aria-label={ariaLabel ?? label}
    >
      <span className="desktop-icon__glyph" aria-hidden="true">
        <span className="desktop-icon__bin" />
        <span className="desktop-icon__lid" />
      </span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  );
}
