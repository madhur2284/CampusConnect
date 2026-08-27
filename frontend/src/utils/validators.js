export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPassword = (value = "") => value.length >= 8;

// Backend enforces contact_number length between 10 and 15 characters
// (see app/schemas/auth.py -> Register.contact_number).
export const isValidContactNumber = (value = "") => {
  const trimmed = value.trim();
  return (
    trimmed.length >= 10 &&
    trimmed.length <= 15 &&
    /^[0-9+\-\s()]+$/.test(trimmed)
  );
};

export const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};
