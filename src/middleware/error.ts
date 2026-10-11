import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { fail } from "../lib/http";

export function notFound(req: Request, res: Response) {
  return fail(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(error);

  if (error instanceof ZodError) {
    return fail(res, "Validation failed", 400, error.flatten());
  }

  return fail(res, "Internal server error", 500);
}
