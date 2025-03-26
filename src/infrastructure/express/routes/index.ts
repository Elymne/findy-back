import { Router } from "express"

import jobRouter from "./jobs"
import offerRouter from "./offers"
import sampleRouter from "./samples"
import schoolRouter from "./schools"
import scrapperRouter from "./scrappers"
import zoneRouter from "./zone"

const router = Router()

router.use("/jobs", jobRouter)
router.use("/offers", offerRouter)
router.use("/sample", sampleRouter)
router.use("/schools", schoolRouter)
router.use("/scrappers", scrapperRouter)
router.use("/zones", zoneRouter)

export default router
