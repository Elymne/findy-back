import { Router } from "express";

import jobOfferRouter from "./offers";
import textFilterRouter from "./blacklist";

const router = Router();

router.use("/offers", jobOfferRouter);
router.use("/blacklist", textFilterRouter);

export default router;
