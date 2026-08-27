const VARIANTS = {
  primary:
    "bg-pin text-paper hover:bg-pin-dark active:translate-y-px shadow-card",
  secondary:
    "bg-tape text-paper hover:bg-tape-dark active:translate-y-px shadow-card",
  ghost:
    "bg-transparent text-ink border-2 border-ink/20 hover:border-ink/50",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-body font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
      )}
      {children}
    </button>
  );
}
