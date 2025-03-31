import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Offer from "@App/domain/models/Offer.model"
import OfferScrapperRepository from "@App/domain/repositories/OfferScrapper.repository"

export default class ScrapOnePage extends Usecase<Offer[], ScrapOnePageParams> {
    private offerScrapperRepository: OfferScrapperRepository

    constructor(offerScrapperRepository: OfferScrapperRepository) {
        super()
        this.offerScrapperRepository = offerScrapperRepository
    }

    public async perform(params: ScrapOnePageParams): Promise<Result<Offer[]>> {
        try {
            const result = await this.offerScrapperRepository.getOnePage(params.pageIndex)
            if (result.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to scrap offers from webpage : none found (odd behavior).`, result, SuccessType.WARNING)
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
