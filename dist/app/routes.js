"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("./service");
const router = (0, express_1.Router)();
router.post("/jobs", service_1.postJobs);
router.get("/telex-config", service_1.telexConfig);
exports.default = router;
