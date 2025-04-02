import { Router } from "express"

import jobRouter from "./jobs"
import offerRouter from "./offers"
import sampleRouter from "./samples"
import schoolRouter from "./schools"
import scrapperRouter from "./scrappers"
import zoneRouter from "./zone"
import updateRouter from "./updates"
import express, { Request, Response } from "express"

const router = Router()

router.use("/jobs", jobRouter)
router.use("/offers", offerRouter)
router.use("/sample", sampleRouter)
router.use("/schools", schoolRouter)
router.use("/scrappers", scrapperRouter)
router.use("/zones", zoneRouter)
router.use("/updates", updateRouter)

// Simple route test.
router.use(
    "/test",
    express.Router().get("/", async (req: Request, res: Response) => {
        res.status(0).send({ message: "This is a test!" })
    })
)

export default router
