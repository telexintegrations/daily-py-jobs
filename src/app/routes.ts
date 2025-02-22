import { Router } from "express";
import { telexWebhook, telexConfig } from "./service";

const router = Router();

router.post("/jobs", telexWebhook);
router.get("/telex-config", telexConfig);

export default router;
