import { Router } from "express"
import { scrapHelloworkPage, scrapHelloworkPages } from "./scrapHelloworkRoutes"

const scrapperRouter = Router()

scrapperRouter.use(scrapHelloworkPages)
scrapperRouter.use(scrapHelloworkPage)

export default scrapperRouter
