export default function Spinner({ label = "Loading" }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-pin" />
      <span className="font-hand text-lg">{label}...</span>
    </div>
  );
}
