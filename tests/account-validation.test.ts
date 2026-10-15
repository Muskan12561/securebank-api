import { describe, expect, it } from "vitest";
import { moneySchema } from "../src/validators/account";

describe("Money validation", () => {
  it("accepts a valid amount", () => {
    expect(
      moneySchema.safeParse({ amount: 500 }).success
    ).toBe(true);
  });

  it("accepts an amount provided as a numeric string", () => {
    expect(
      moneySchema.safeParse({ amount: "500" }).success
    ).toBe(true);
  });

  it("rejects zero", () => {
    expect(
      moneySchema.safeParse({ amount: 0 }).success
    ).toBe(false);
  });

  it("rejects a negative amount", () => {
    expect(
      moneySchema.safeParse({ amount: -100 }).success
    ).toBe(false);
  });

  it("rejects an amount above the limit", () => {
    expect(
      moneySchema.safeParse({ amount: 10000001 }).success
    ).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    expect(
      moneySchema.safeParse({ amount: "abc" }).success
    ).toBe(false);
  });
});