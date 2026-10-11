import { describe, expect, it } from "vitest";
import { isValidCurrency } from "../src/currency";

describe("Currency validation", () => {
  it("accepts INR", () => {
    expect(isValidCurrency("INR")).toBe(true);
  });

  it("accepts USD", () => {
    expect(isValidCurrency("USD")).toBe(true);
  });

  it("accepts EUR", () => {
    expect(isValidCurrency("EUR")).toBe(true);
  });

  it("rejects invalid currency", () => {
    expect(isValidCurrency("XYZ")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isValidCurrency(123)).toBe(false);
  });
});
