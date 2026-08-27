export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="corkboard flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rotate-[-1deg] rounded-sm bg-paper p-8 shadow-pin">
        <div className="mx-auto -mt-14 mb-5 h-8 w-24 rotate-2 border border-black/5 bg-marker/70 shadow-card" />
        <h1 className="text-center font-display text-3xl text-ink">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center font-hand text-lg text-ink-soft">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
