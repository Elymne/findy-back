import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import HelloworkDatasource from "@App/infrastructure/datasources/scrappers/hellowork/HelloworkDatasource"
import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase"
import ScrapPages from "@App/domain/usecases/scrapping/ScrapPages.usecase"
import { Failure, Success } from "@App/core/Result"

const scrapOnePage: ScrapOnePage = new ScrapOnePage(new HelloworkDatasource())
const scrapPages: ScrapPages = new ScrapPages(scrapOnePage)

export const scrapHelloworkPages = express
    .Router()
    .get("/hellowork", query("pagenumber").isInt().optional({ values: "null" }), query("maxday").isInt().optional({ values: "null" }), async (req: Request, res: Response) => {
        const validator = validationResult(req)
        if (!validator.isEmpty()) {
            res.status(400).send(validator)
            return
        }

        const pageNumber = req.query.pagenumber ? parseInt(req.query.pagenumber as string) : undefined
        const maxDay = req.query.maxday ? parseInt(req.query.maxday as string) : undefined

        const result = await scrapPages.perform({
            pageNumber: pageNumber,
            maxDay: maxDay,
        })

        if (result instanceof Failure) {
            res.status(result.code).send(result.error)
            return
        }

        if (result instanceof Success) {
            res.status(result.code).send(result.data)
            return
        }

        res.status(result.code).send({ message: "Unknown type of result." })
    })

export const scrapHelloworkPage = express.Router().get("/hellowork/:index", async (req: Request, res: Response) => {
    const index = req.params.index ? parseInt(req.params.index as string) : null
    if (!index) {
        res.status(400).send({
            message: `Bad request`,
            details: `The route that you are using need an page index. Actually it's ${req.params.index} that is given.`,
        })
        return
    }

    const result = await scrapOnePage.perform({ pageIndex: index })
    if (result instanceof Failure) {
        res.status(result.code).send(result.error)
        return
    }

    if (result instanceof Success) {
        res.status(result.code).send(result.data)
        return
    }

    res.status(result.code).send({ message: "Unknown type of result." })
})
