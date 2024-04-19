import { Router } from "express"

import jobOfferRouter from "./jobsOffers"
import cityRouter from "./cities"
import textFilterRouter from "./textFilters"

const router = Router()

router.use("/jobs", jobOfferRouter)
router.use("/cities", cityRouter)
router.use("/text-filters", textFilterRouter)

export default router
