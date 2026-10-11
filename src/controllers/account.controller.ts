import { Request, Response } from "express";
import { fail, ok } from "../lib/http";
import * as service from "../services/account.service";
import { moneySchema } from "../validators/account";
import { isValidCurrency } from "../currency";

export async function create(req: Request, res: Response) {
  const currency = req.body.currency ?? "INR";

  if (!isValidCurrency(currency)) {
    return res.status(400).json({
      success: false,
      error: "Invalid currency. Allowed currencies: INR, USD, EUR"
    });
  }

  const account = await service.createAccount(
    req.user!.sub,
    currency
  );

  return ok(res, account, 201);
}

export async function list(req: Request, res: Response) {
  return ok(res, await service.listMyAccounts(req.user!.sub));
}

export async function getOne(req: Request, res: Response) {
  const account = await service.getMyAccount(req.user!.sub, req.params.id as string);
  if (!account) return fail(res, "Account not found", 404);
  return ok(res, account);
}

export async function deposit(req: Request, res: Response) {
  try {
    const input = moneySchema.parse(req.body);
    const result = await service.deposit(req.user!.sub, req.params.id as string, input.amount, input.description);
    return ok(res, result);
  } catch (error) {
    if (error instanceof Error) {
      const map: Record<string, [string, number]> = {
        ACCOUNT_NOT_FOUND: ["Account not found", 404],
        ACCOUNT_NOT_ACTIVE: ["Account is not active", 403]
      };
      const item = map[error.message];
      if (item) return fail(res, item[0], item[1]);
    }
    throw error;
  }
}

export async function withdraw(req: Request, res: Response) {
  try {
    const input = moneySchema.parse(req.body);
    const result = await service.withdraw(req.user!.sub, req.params.id as string, input.amount, input.description);
    return ok(res, result);
  } catch (error) {
    if (error instanceof Error) {
      const map: Record<string, [string, number]> = {
        ACCOUNT_NOT_FOUND: ["Account not found", 404],
        ACCOUNT_NOT_ACTIVE: ["Account is not active", 403],
        INSUFFICIENT_FUNDS: ["Insufficient funds", 400]
      };
      const item = map[error.message];
      if (item) return fail(res, item[0], item[1]);
    }
    throw error;
  }
}
