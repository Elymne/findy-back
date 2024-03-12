import { Router } from "express"
import jobsRoutes from "./jobs.routes"
import municipalitiesRoutes from "./city.routes"
import testRoute from "./test.routes"

const router = Router()

router.use("/jobs", jobsRoutes)
router.use("/cities", municipalitiesRoutes)
router.use("/test", testRoute)

export default router
