
import { describe, expect, it } from "vitest";
import { transferSchema } from "../src/validators/transfer";

const validTransfer = {
  fromAccountId: "29418ebf-3702-4c73-b9e1-938120a869a3",
  toAccountNumber: "1234567890",
  amount: 500
};

describe("Transfer validation", () => {
  it("accepts valid transfer details", () => {
    expect(transferSchema.safeParse(validTransfer).success).toBe(true);
  });

  it("rejects an invalid source account ID", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        fromAccountId: "invalid-id"
      }).success
    ).toBe(false);
  });

  it("rejects an account number that is not 10 digits", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        toAccountNumber: "12345"
      }).success
    ).toBe(false);
  });

  it("rejects a zero transfer amount", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        amount: 0
      }).success
    ).toBe(false);
  });

  it("rejects a negative transfer amount", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        amount: -100
      }).success
    ).toBe(false);
  });

  it("rejects an amount above the maximum limit", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        amount: 10000001
      }).success
    ).toBe(false);
  });

  it("accepts an optional description", () => {
    expect(
      transferSchema.safeParse({
        ...validTransfer,
        description: "Rent payment"
      }).success
    ).toBe(true);
  });
});
