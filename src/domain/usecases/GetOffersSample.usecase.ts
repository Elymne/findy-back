import { Usecase, Result, ResultType } from "@App/core/Usecase";
import Offer from "../models/Offer.model";
import OfferRepository from "../repositories/Offer.repository";

export interface GetOffersSampleParams {
    code: number;
}

export default class GetOffersSample extends Usecase<Offer[], GetOffersSampleParams> {
    private offerRepository: OfferRepository;

    public constructor(offerRepository: OfferRepository) {
        super();
        this.offerRepository = offerRepository;
    }

    public async perform(params: GetOffersSampleParams): Promise<Result<Offer[]>> {
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
