import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth";
import { fail, ok } from "../lib/http";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    return ok(res, result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return fail(res, "Email already registered", 409);
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    return ok(res, result);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return fail(res, "Invalid email or password", 401);
    }
    if (error instanceof Error && error.message === "USER_NOT_ACTIVE") {
      return fail(res, "User account is not active", 403);
    }
    throw error;
  }
}

export function me(req: Request, res: Response) {
  return ok(res, { userId: req.user?.sub, role: req.user?.role });
}
