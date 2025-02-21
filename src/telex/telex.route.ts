import { Router } from "express";
import { getJobs } from "./telex.service";

const router = Router();

router.get("/jobs", getJobs);

export default router;
