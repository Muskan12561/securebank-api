import { Router } from "express";
import { UserRole } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth";
import * as controller from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(UserRole.ADMIN));
router.get("/users", controller.users);
router.get("/accounts", controller.accounts);
router.get("/transactions", controller.transactions);

export default router;
