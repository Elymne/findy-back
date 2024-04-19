import { Router } from "express"
import addManyTextFiltersRoute from "./addMany.route"
import getAllTextFiltersRoute from "./getAll.route"

const textFilterRouter = Router()

textFilterRouter.use(addManyTextFiltersRoute)
textFilterRouter.use(getAllTextFiltersRoute)

export default textFilterRouter
