export default function Input({
  label,
  id,
  error,
  hint,
  className = "",
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-hand text-lg leading-none text-ink-soft"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        className={`w-full rounded-sm border-2 bg-paper px-3.5 py-2.5 font-body text-ink placeholder:text-ink-soft/50 focus:outline-none transition-colors ${
          error
            ? "border-pin focus:border-pin"
            : "border-ink/15 focus:border-tape"
        } ${className}`}
        {...rest}
      />
      {hint && !error && (
        <span className="text-xs text-ink-soft/80">{hint}</span>
      )}
      {error && <span className="text-xs font-medium text-pin">{error}</span>}
    </div>
  );
}
