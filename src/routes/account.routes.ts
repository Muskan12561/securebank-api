import { Router } from "express";
import * as controller from "../controllers/account.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/:id/deposit", controller.deposit);
router.post("/:id/withdraw", controller.withdraw);

export default router;
