import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import ScrapSite from "@App/domain/usecases/scrapping/ScrapSite.usecase"
import { Failure, Success } from "@App/core/Result"
import { container } from "tsyringe"
import { ScrapHelloworkPage, ScrapHelloworkSite } from "@App/infrastructure/di/di"
import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase"

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

        const result = await container.resolve<ScrapSite>(ScrapHelloworkSite).perform({
            pageNumber: pageNumber,
            newestDate: maxDay ? new Date(maxDay) : undefined,
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

    const result = await container.resolve<ScrapOnePage>(ScrapHelloworkPage).perform({ pageIndex: index })
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
