import { Usecase } from "@App/core/Usecase"
import ScrapOnePage from "./ScrapOnePage.usecase"
import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import OfferScrap from "@App/domain/models/scrap/Offer.scrap"

export default class ScrapSite extends Usecase<OfferScrap[], ScrapSiteParams> {
    private scrapOnePage: ScrapOnePage

    constructor(scrapOnePage: ScrapOnePage) {
        super()
        this.scrapOnePage = scrapOnePage
    }

    public async perform(params: ScrapSiteParams): Promise<Result<OfferScrap[]>> {
        try {
            const result: OfferScrap[] = []
            const streamedPageScrapping: Promise<Result<OfferScrap[]>>[] = []

            // When params.pageNumber is define.
            if (params.pageNumber) {
                for (let i = 1; i <= params.pageNumber; i++) {
                    streamedPageScrapping.push(this.scrapOnePage.perform({ pageIndex: i }))
                }

                const resultsFromScrapping = await Promise.all(streamedPageScrapping)
                for (const r of resultsFromScrapping) {
                    if (r instanceof Success) {
                        result.push(...r.data)
                    }
                }

                if (result.length == 0) {
                    return new Success(204, `[${this.constructor.name}] Trying to scrap offers from webpage : none found (odd behavior)`, result, SuccessType.WARNING)
                }

                return new Success(200, `[${this.constructor.name}] Trying to scrap offers from webpage : success`, result)
            }

            // When params.maxDay is define.
            if (params.maxDay) {
                return new Success(204, `[${this.constructor.name}] Trying to scrap offers from webpage : Not implemented yet tho.`, result)
            }

            return new Failure(400, `[${this.constructor.name}] Trying to scrap offers from webpage : Wrong user input`, {
                message: "Wrong user input : pageNumber and maxDay both undefined.",
            })
        } catch (trace) {
            return new Failure(400, `[${this.constructor.name}] Trying to scrap offers from webpage : An exception has been thrown.`, "", trace)
        }
    }
}

/**
 * Only one of the two properties should be defined. In case two are defined, the pageNumber will be the first priority.
 * @prop {number | undefined} pageNumber - The maximum page you want to scrap from 1 to the number you want.
 * @prop {number | undefined} maxDay - The value of maximum oldest date of offers you want to scrap.
 */
export interface ScrapSiteParams {
    pageNumber?: number
    maxDay?: number
}
