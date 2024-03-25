import { Router } from "express"
import getAllCitiesRoute from "./getAll.route"
import getOneCityByCodeRoute from "./getOneByCode.route"

const cityRouter = Router()

cityRouter.use(getAllCitiesRoute)
cityRouter.use(getOneCityByCodeRoute)

export default cityRouter
