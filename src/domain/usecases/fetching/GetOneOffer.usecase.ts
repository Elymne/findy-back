import { Result, ResultType, Usecase } from "@App/core/Usecase";
import OfferDetailed from "@App/domain/models/OfferDetailed.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";

export default class GetOneOffer extends Usecase<OfferDetailed, GetOneOfferParams> {
    private offerRepository: OfferRepository;

    constructor(offerRepository: OfferRepository) {
        super();
        this.offerRepository = offerRepository;
    }

    public async perform(params: GetOneOfferParams): Promise<Result<OfferDetailed>> {
        try {
            const result = await this.offerRepository.findOne(params.id);
            if (!result) {
                return new Result<OfferDetailed>(ResultType.FAILURE, 404, "[GetOneOffer] Offer not found.", null, null);
            }

            return new Result(ResultType.SUCCESS, 200, "[GetOneOffer] Offer found.", result, null);
        } catch (err) {
            return new Result<OfferDetailed>(ResultType.FAILURE, 500, "[GetOneOffer] An exception has been throw. Check logs.", null, err);
        }
    }
}

export interface GetOneOfferParams {
    id: string;
}
