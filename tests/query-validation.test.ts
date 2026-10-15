
import { describe, expect, it } from "vitest";
import { transactionQuerySchema } from "../src/validators/query";

describe("Transaction query validation", () => {
  it("uses default page and limit", () => {
    const result = transactionQuerySchema.safeParse({});

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("accepts valid pagination values as strings", () => {
    const result = transactionQuerySchema.safeParse({
      page: "2",
      limit: "50"
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(50);
    }
  });

  it("accepts a valid transaction type", () => {
    expect(
      transactionQuerySchema.safeParse({ type: "DEPOSIT" }).success
    ).toBe(true);
  });

  it("rejects an invalid transaction type", () => {
    expect(
      transactionQuerySchema.safeParse({ type: "PAYMENT" }).success
    ).toBe(false);
  });

  it("rejects a zero page number", () => {
    expect(
      transactionQuerySchema.safeParse({ page: 0 }).success
    ).toBe(false);
  });

  it("rejects a zero limit", () => {
    expect(
      transactionQuerySchema.safeParse({ limit: 0 }).success
    ).toBe(false);
  });

  it("rejects a limit above 100", () => {
    expect(
      transactionQuerySchema.safeParse({ limit: 101 }).success
    ).toBe(false);
  });
});
