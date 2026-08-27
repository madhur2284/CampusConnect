export default function EmptyState({ title, description, action, tone = "dark" }) {
  const toneClasses =
    tone === "dark"
      ? "border-paper/40 text-paper"
      : "border-ink/20 text-ink-soft";

  return (
    <div
      className={`mx-auto flex max-w-md flex-col items-center gap-3 rounded-md border-2 border-dashed px-8 py-16 text-center ${toneClasses}`}
    >
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="text-sm opacity-80">{description}</p>}
      {action}
    </div>
  );
}
