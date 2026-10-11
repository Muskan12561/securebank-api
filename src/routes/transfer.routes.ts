import { Router } from "express";
import * as controller from "../controllers/transfer.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.post("/", controller.create);

export default router;
