import { failed, Result, succeed } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import OfferDetailed from "@App/domain/models/OfferDetailed.model"
import OfferRemoteRepository from "@App/domain/repositories/OfferRemote.repository"

export default class GetOneOffer extends Usecase<OfferDetailed, GetOneOfferParams> {
    private offerRepository: OfferRemoteRepository

    constructor(offerRepository: OfferRemoteRepository) {
        super()
        this.offerRepository = offerRepository
    }

    public async perform(params: GetOneOfferParams): Promise<Result<OfferDetailed>> {
        try {
            const result = await this.offerRepository.findOne(params.id)
            if (!result) {
                return failed(404, `[${this.constructor.name}] Trying to fetch offer ${params.id} : it doesn't exists`, { message: `Offer with id ${params.id} does not exists.` })
            }
            return succeed(200, `[${this.constructor.name}] Trying to fetch offer ${params.id} : success`, result)
        } catch (trace) {
            return failed(
                500,
                `[${this.constructor.name}] Trying to fetch offer ${params.id} : An exception has been thrown.`,
                { message: "An internal error occured while fetching the offer." },
                trace
            )
        }
    }
}

export interface GetOneOfferParams {
    id: string
}
