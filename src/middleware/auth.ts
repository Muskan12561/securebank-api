import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { verifyToken } from "../utils/jwt";
import { fail } from "../lib/http";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");

  if (!header?.startsWith("Bearer ")) {
    return fail(res, "Missing or invalid Authorization header", 401);
  }

  try {
    req.user = verifyToken(header.slice(7));
    return next();
  } catch {
    return fail(res, "Invalid or expired token", 401);
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, "Forbidden", 403);
    }
    return next();
  };
}
