import { Router } from "express"
import jobsRoutes from "./jobs.routes"
import municipalitiesRoutes from "./municipalities.routes"

const router = Router()

router.use("/jobs", jobsRoutes)
router.use("/municipalities", municipalitiesRoutes)

export default router
