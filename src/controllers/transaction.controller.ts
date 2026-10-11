import { Request, Response } from "express";
import { ok } from "../lib/http";
import * as service from "../services/transaction.service";
import { transactionQuerySchema } from "../validators/query";

export async function list(req: Request, res: Response) {
  const query = transactionQuerySchema.parse(req.query);
  return ok(res, await service.listTransactions(req.user!.sub, query));
}
