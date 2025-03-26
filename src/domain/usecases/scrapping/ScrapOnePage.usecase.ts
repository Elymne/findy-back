import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Offer from "@App/domain/models/Offer.model"
import JobScrapperRepository from "@App/domain/repositories/OfferScrapper.repository"

/**
 * Usecase : Using [ScrapOnePage] Repository to fetch data by scrapping a single job offer web page.
 */
export default class ScrapOnePage extends Usecase<Offer[], ScrapOnePageParams> {
    private jobScrapperRepository: JobScrapperRepository

    constructor(jobScrapperRepository: JobScrapperRepository) {
        super()
        this.jobScrapperRepository = jobScrapperRepository
    }

    public async perform(params: ScrapOnePageParams): Promise<Result<Offer[]>> {
        try {
            const result = await this.jobScrapperRepository.getOnePage(params.pageIndex)
            if (result.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to scrap offers from webpage : none found.`, result)
            }
            return new Success(200, `[${this.constructor.name}] Trying to scrap offers from webpage : success`, result)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to scrap offers from webpage : An exception has been thrown.`,
                { message: "An internal error occured while scrapping offers" },
                trace
            )
        }
    }
}

interface ScrapOnePageParams {
    pageIndex: number
}
