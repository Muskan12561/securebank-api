import { Request, Response } from "express";
import { ok } from "../lib/http";
import * as service from "../services/admin.service";

export async function users(req: Request, res: Response) {
  return ok(res, await service.users());
}

export async function accounts(req: Request, res: Response) {
  return ok(res, await service.accounts());
}

export async function transactions(req: Request, res: Response) {
  return ok(res, await service.transactions());
}
