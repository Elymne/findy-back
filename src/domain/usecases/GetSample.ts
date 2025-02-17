import { Usecase, Result, ResultType } from "@App/core/Usecase";
import Offer from "@App/domain/models/Offer.model";
import OfferRepository from "@App/domain/repositories/Offer.repository";

export interface GetSampleParams {
    code: number;
}

export default class GetSample extends Usecase<Offer[], GetSampleParams> {
    private offerRepository: OfferRepository;

    public constructor(offerRepository: OfferRepository) {
        super();
        this.offerRepository = offerRepository;
    }

    public async perform(params: GetSampleParams): Promise<Result<Offer[]>> {
        try {
            let keywords: string | null = null;
            switch (params.code) {
                case 1:
                    keywords = "Développeur ET Alternance";
                    break;
            }
            if (!keywords) {
                return new Result<Offer[]>(ResultType.SUCCESS, 204, "[GetOffersSample] This sample code doesn't exists.", null, null);
            }

            const offers = await this.offerRepository.findManyBySearch(keywords, null, null);
            if (offers.length == 0) {
                return new Result<Offer[]>(ResultType.SUCCESS, 204, "[GetOffersSample] No offer founded for this sample.", null, null);
            }

            return new Result<Offer[]>(ResultType.SUCCESS, 200, "[GetOffersSample] Offers from sample founded successfully.", offers.slice(0, 6), null);
        } catch (err) {
            return new Result<Offer[]>(ResultType.FAILURE, 500, "[GetOffersSample] An exception has been throw. Check logs.", null, err);
        }
    }
}
