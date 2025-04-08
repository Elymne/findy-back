import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import OfferDetailed from "@App/domain/models/clean/OfferDetailed.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"

export default class GetOneOffer extends Usecase<OfferDetailed, GetOneOfferParams> {
    private offerLocalRepository: OfferLocalRepository

    constructor(offerLocalRepository: OfferLocalRepository) {
        super()
        this.offerLocalRepository = offerLocalRepository
    }

    public async perform(params: GetOneOfferParams): Promise<Result<OfferDetailed>> {
        try {
            const result = await this.offerLocalRepository.findOne(params.id)
            if (!result) {
                return new Failure(404, `[${this.constructor.name}] Trying to fetch offer ${params.id} : it doesn't exists`, { message: `Offer with id ${params.id} does not exists.` })
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch offer ${params.id} : success`, result)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to fetch offer ${params.id} : An exception has been thrown.`,
                { message: "An internal error occured while fetching the offer." },
                trace
            )
        }
    }
}

type GetOneOfferParams = {
    id: string
}
