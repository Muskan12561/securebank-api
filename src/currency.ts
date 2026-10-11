export const ALLOWED_CURRENCIES = ["INR", "USD", "EUR"] as const;

export function isValidCurrency(
  currency: unknown
): currency is (typeof ALLOWED_CURRENCIES)[number] {
  return (
    typeof currency === "string" &&
    ALLOWED_CURRENCIES.includes(currency as (typeof ALLOWED_CURRENCIES)[number])
  );
}