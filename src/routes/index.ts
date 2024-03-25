import { Router } from "express"

import jobOfferRouter from "./jobsOffers"
import cityRouter from "./cities"
import testRouter from "./test.routes"

const router = Router()

router.use("/jobs", jobOfferRouter)
router.use("/cities", cityRouter)
router.use("/cities", testRouter)

export default router
