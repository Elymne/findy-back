import { Router } from "express";

import textFilterRouter from "./blacklist";
import offersRouter from "./offers";

const router = Router();

router.use("/offers", offersRouter);
router.use("/blacklist", textFilterRouter);

export default router;
