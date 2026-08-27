import Button from "./Button";

export default function Pagination({
  pageNumber,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
  className = "",
}) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <Button
        variant="ghost"
        disabled={!hasPrevious}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        ← Previous
      </Button>
      <span className="font-hand text-lg text-ink-soft">
        Page {pageNumber} of {totalPages}
      </span>
      <Button
        variant="ghost"
        disabled={!hasNext}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next →
      </Button>
    </div>
  );
}
