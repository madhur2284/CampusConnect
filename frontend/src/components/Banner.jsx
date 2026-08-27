const TONES = {
  error: "bg-pin/10 border-pin text-pin-dark",
  info: "bg-tape/10 border-tape text-tape-dark",
  success: "bg-leaf/10 border-leaf text-leaf",
};

export default function Banner({ tone = "info", children, className = "" }) {
  if (!children) return null;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-sm border-l-4 px-4 py-3 text-sm font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
