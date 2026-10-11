import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth";

export function signToken(userId: string, role: UserRole) {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
