import { Router } from "express"
import getAllCitiesRoute from "./getAll.route"
import getOneCityByCodeRoute from "./getOneByCode.route"
import getOneCityByNameRoute from "./getOneByName.route"

const cityRouter = Router()

cityRouter.use(getAllCitiesRoute)
cityRouter.use(getOneCityByCodeRoute)
cityRouter.use(getOneCityByNameRoute)

export default cityRouter
