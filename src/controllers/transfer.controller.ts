import { Request, Response } from "express";
import { fail, ok } from "../lib/http";
import * as service from "../services/transfer.service";
import { transferSchema } from "../validators/transfer";

export async function create(req: Request, res: Response) {
  try {
    const input = transferSchema.parse(req.body);
    const key = req.header("Idempotency-Key") ?? "";
    const result = await service.transfer(req.user!.sub, key, input);

    return ok(res, result, result.reused ? 200 : 201);
  } catch (error) {
    if (error instanceof Error) {
      const map: Record<string, [string, number]> = {
        INVALID_IDEMPOTENCY_KEY: ["A valid Idempotency-Key header is required", 400],
        IDEMPOTENCY_KEY_IN_USE: ["Idempotency key belongs to another user", 409],
        SOURCE_ACCOUNT_NOT_FOUND: ["Source account not found", 404],
        SOURCE_ACCOUNT_NOT_ACTIVE: ["Source account is not active", 403],
        DESTINATION_ACCOUNT_NOT_FOUND: ["Destination account not found", 404],
        DESTINATION_ACCOUNT_NOT_ACTIVE: ["Destination account is not active", 403],
        SAME_ACCOUNT_TRANSFER: ["Source and destination accounts must differ", 400],
        INSUFFICIENT_FUNDS: ["Insufficient funds", 400],
        USER_NOT_FOUND: ["User not found", 404]
      };
      const item = map[error.message];
      if (item) return fail(res, item[0], item[1]);
    }
    throw error;
  }
}
