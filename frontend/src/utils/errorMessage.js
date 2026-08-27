/**
 * FastAPI error responses come in two shapes:
 *  - HTTPException -> { detail: "Some message string" }
 *  - Pydantic validation (422) -> { detail: [{ loc, msg, type }, ...] }
 * This normalizes both (plus network errors) into a single display string.
 */
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const detail = err?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) {
      const field = Array.isArray(first.loc) ? first.loc.at(-1) : null;
      return field ? `${field}: ${first.msg}` : first.msg;
    }
  }

  if (err?.message === "Network Error") {
    return "Can't reach the server. Check your connection or try again shortly.";
  }

  return fallback;
}
