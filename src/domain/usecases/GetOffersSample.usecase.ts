import { Result, ResultType, Usecase } from "@App/core/usecase";
import Offer from "../models/Offer.model";
import { FranceTravailDatasource } from "@App/infrastructure/datasources/FranceTravailDatasource";

export const GetOffersSample: Usecase<Offer[], number> = {
    perform: async function (params: number): Promise<Result<Offer[]>> {
        try {
            let keywords: string | null = null;

            switch (params) {
                case 1:
                    keywords = "Développeur";
                    break;
            }
            if (!keywords) {
                return new Result<Offer[]>(ResultType.SUCCESS, 204, "[GetOffersSample] This sample code doesn't exists.", null, null);
            }

            const offers = await FranceTravailDatasource.findManyBySearch("", "44120", null);
            if (offers.length == 0) {
                return new Result<Offer[]>(ResultType.SUCCESS, 204, "[GetOffersSample] No offer founded for this sample.", null, null);
            }

            return new Result<Offer[]>(ResultType.SUCCESS, 200, "[GetOffersSample] Offers from sample founded successfully.", offers.slice(0, 4), null);
        } catch (err) {
            return new Result<Offer[]>(ResultType.FAILURE, 500, "[GetOffersSample] An exception has been throw. Check logs.", null, err);
        }
    },
};
