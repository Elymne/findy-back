import { Result, ResultType, UsecaseNoParams } from "@App/core/Usecase";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";

export default class GetSample extends UsecaseNoParams<Offer[]> {
    private offerRepository: OfferRepository;

    public constructor(offerRepository: OfferRepository) {
        super();
        this.offerRepository = offerRepository;
    }

    public async perform(): Promise<Result<Offer[]>> {
        try {
            const offers = await this.offerRepository.findManyBySearch({});
            if (offers.length == 0) {
                return new Result<Offer[]>(ResultType.SUCCESS, 204, "[GetOffersSample] No offers where founded.", null, null);
            }
            return new Result<Offer[]>(ResultType.SUCCESS, 200, "[GetOffersSample] Offers from sample founded successfully.", offers.slice(0, 6), null);
        } catch (err) {
            return new Result<Offer[]>(ResultType.FAILURE, 500, "[GetOffersSample] An exception has been throw. Check logs.", null, err);
        }
    }
}
