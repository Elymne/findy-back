import { Usecase } from "@App/core/Usecase"
import Offer from "@App/domain/models/Offer.model"
import ScrapOnePage from "./ScrapOnePage.usecase"
import { failed, Result, succeed, SuccessType } from "@App/core/Result"

/**
 * Scrap a precise number of pages from any web site given the repository implementation of {ScrapOnePage} usecase used here..
 * @prop {ScrapOnePage} ScrapOnePage
 * @extends {Usecase}
 */
export default class ScrapPages extends Usecase<Offer[], ScrapPagesParams> {
    private scrapOnePage: ScrapOnePage

    constructor(scrapOnePage: ScrapOnePage) {
        super()
        this.scrapOnePage = scrapOnePage
    }

    public async perform(params: ScrapPagesParams): Promise<Result<Offer[]>> {
        try {
            const result: Offer[] = []
            const streamedPageScrapping: Promise<Result<Offer[]>>[] = []

            // When params.pageNumber is define.
            if (params.pageNumber) {
                for (let i = 1; i <= params.pageNumber; i++) {
                    streamedPageScrapping.push(this.scrapOnePage.perform({ pageIndex: i }))
                }

                const results = await Promise.all(streamedPageScrapping)

                for (const r of results) {
                    if (r.type == ResultType.SUCCESS) {
                        result.push(...(r.data ?? []))
                    }
                }

                if (results.length == 0) {
                    return succeed(204, `[${this.constructor.name}] Trying to scrap offers from webpage : none found (odd behavior)`, result, SuccessType.WARNING)
                }

                return succeed(204, `[${this.constructor.name}] Trying to scrap offers from webpage : success`, result)
            }

            // When params.maxDay is define.
            if (params.maxDay) {
                return succeed(204, `[${this.constructor.name}] Trying to scrap offers from webpage : Not implemented yet tho.`, result)
            }

            return failed(400, `[${this.constructor.name}] Trying to scrap offers from webpage : Wrong user input`, {
                message: "Wrong user input : pageNumber and maxDay both undefined.",
            })
        } catch (trace) {
            return failed(400, `[${this.constructor.name}] Trying to scrap offers from webpage : An exception has been thrown.`, "", trace)
        }
    }
}

/**
 * Only one of the two properties should be defined. In case two are defined, the pageNumber will be the first priority.
 * @prop {number | undefined} pageNumber - The maximum page you want to scrap from 1 to the number you want.
 * @prop {number | undefined} maxDay - The value of maximum oldest date of offers you want to scrap.
 */
export interface ScrapPagesParams {
    pageNumber: number | undefined
    maxDay: number | undefined
}
