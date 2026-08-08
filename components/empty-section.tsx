type EmptySectionProps = {
  title: string;
  message: string;
};

export function EmptySection({ title, message }: EmptySectionProps) {
  return (
    <section className="finder-message" aria-labelledby={`empty-${title}`}>
      <h2 id={`empty-${title}`}>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
