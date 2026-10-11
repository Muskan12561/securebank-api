import { Router } from "express";
import * as controller from "../controllers/transaction.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", controller.list);

export default router;
