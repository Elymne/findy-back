import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Offer from "@App/domain/models/clean/Offer.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"

// TODO Rework.
export default class GetSample extends UsecaseNoParams<Offer[]> {
    private offerLocalRepository: OfferLocalRepository

    public constructor(offerLocalRepository: OfferLocalRepository) {
        super()
        this.offerLocalRepository = offerLocalRepository
    }

    public async perform(): Promise<Result<Offer[]>> {
        try {
            const offers = await this.offerLocalRepository.findMany({
                range: "1-6",
            })
            if (offers.length == 0) {
                return new Success(200, `[${this.constructor.name}] Trying to fetch sample : none found (odd behavior)`, offers, SuccessType.WARNING)
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch sample : success.`, offers)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] Trying to fetch sample : An exception has been thrown.`, { message: "An internal error occured while fetching the sample." }, trace)
        }
    }
}
