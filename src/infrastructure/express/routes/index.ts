import { Router } from "express";

import schoolRouter from "./schools";
import offerRouter from "./offers";
import jobRouter from "./jobs";
import zoneRouter from "./zone";

const router = Router();

router.use("/jobs", jobRouter);
router.use("/offers", offerRouter);
router.use("/zones", zoneRouter);
router.use("/schools", schoolRouter);

export default router;
