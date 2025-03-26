import { failed, Result, succeed, SuccessType } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Offer from "@App/domain/models/Offer.model"
import OfferRemoteRepository from "@App/domain/repositories/OfferRemote.repository"

export default class GetSample extends UsecaseNoParams<Offer[]> {
    private offerRepository: OfferRemoteRepository

    public constructor(offerRepository: OfferRemoteRepository) {
        super()
        this.offerRepository = offerRepository
    }

    public async perform(): Promise<Result<Offer[]>> {
        try {
            const offers = await this.offerRepository.findManyBySearch({})
            if (offers.length == 0) {
                return succeed(204, `[${this.constructor.name}] Trying to fetch sample : none found (odd behavior)`, offers, SuccessType.WARNING)
            }
            return succeed(200, `[${this.constructor.name}] Trying to fetch sample : success.`, offers.slice(0, 6))
        } catch (trace) {
            return failed(500, `[${this.constructor.name}] Trying to fetch sample : An exception has been thrown.`, { message: "An internal error occured while fetching the sample." }, trace)
        }
    }
}
