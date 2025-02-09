import { Result, ResultType, Usecase } from "@App/core/usecase";
import Offers from "../models/Offers.model";
import { FranceTravailDatasource } from "@App/infrastructure/datasources/FranceTravailDatasource";

const elementByPage: number = 20;

interface GetOffersFromSearchParams {
    keywords: string;
    codeZone: string;
    distance: number;
    page: number;
}

export const GetOffersFromSearch: Usecase<Offers, GetOffersFromSearchParams> = {
    perform: async function (params: GetOffersFromSearchParams): Promise<Result<Offers>> {
        try {
            const offers = await FranceTravailDatasource.findManyBySearch(params.keywords, params.codeZone, params.distance);
            if (offers.length == 0) {
                return new Result<Offers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] No offers found.", null, null);
            }

            const indexStart = elementByPage * params.page;
            if (offers.length < indexStart) {
                return new Result<Offers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] The page requested doesn't exists.", null, null);
            }

            const indexEnd = elementByPage * (params.page + 1);
            const resultByPage = offers.slice(indexStart, indexEnd);
            const maxPage = offers.length % elementByPage;
            return new Result<Offers>(
                ResultType.SUCCESS,
                200,
                "[GetOffersFromSearch] Offers founded successfully.",
                {
                    jobs: resultByPage,
                    currentPage: params.page,
                    maxPage: maxPage,
                },
                null
            );
        } catch (err) {
            return new Result<Offers>(ResultType.FAILURE, 500, "[GetOffersFromSearch] An exception has been throw. Check logs.", null, err);
        }
    },
};
