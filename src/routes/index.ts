import { Router } from "express"
import jobsRoutes from "./jobs.routes"
import municipalitiesRoutes from "./city.routes"

const router = Router()

router.use("/jobs", jobsRoutes)
router.use("/cities", municipalitiesRoutes)

export default router
