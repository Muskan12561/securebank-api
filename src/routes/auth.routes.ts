import { Router } from "express";
import { authRateLimit } from "../middleware/rateLimit";
import * as controller from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", authRateLimit, controller.register);
router.post("/login", authRateLimit, controller.login);
router.get("/me", requireAuth, controller.me);

export default router;
