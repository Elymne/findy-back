import { Router } from "express";

import textFilterRouter from "./blacklist";
import offerRouter from "./offers";
import jobRouter from "./jobs";

const router = Router();

router.use("/jobs", jobRouter);
router.use("/offers", offerRouter);
router.use("/blacklist", textFilterRouter);

export default router;
