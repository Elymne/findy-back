import { Router } from "express"

import jobOfferRouter from "./jobsOffers"
import textFilterRouter from "./textFilters"

const router = Router()

router.use("/jobs", jobOfferRouter)
router.use("/text-filters", textFilterRouter)

export default router
