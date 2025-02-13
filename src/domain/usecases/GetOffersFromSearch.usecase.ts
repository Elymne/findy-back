import { Result, ResultType, Usecase } from "@App/core/Usecase";
import PageOffers from "../models/PageOffers.model";
import OfferDatasource from "@App/infrastructure/datasources/OfferDatasource";

export default class GetOffersFromSearch extends Usecase<PageOffers, GetOffersFromSearchParams> {
    private offerDatasource: OfferDatasource;

    public constructor(offerDatasource: OfferDatasource) {
        super();
        this.offerDatasource = offerDatasource;
    }

    public async perform(params: GetOffersFromSearchParams): Promise<Result<PageOffers>> {
        try {
            const offers = await this.offerDatasource.findManyBySearch(`Alternant Alternante Alternance ${params.keywords}`, params.codeZone, params.distance);
            if (offers.length == 0) {
                return new Result<PageOffers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] No offers found.", null, null);
            }

            if (!params.page) {
                return new Result<PageOffers>(
                    ResultType.SUCCESS,
                    200,
                    "[GetOffersFromSearch] Offers founded successfully.",
                    {
                        jobs: offers,
                        currentPage: 0,
                        maxPage: 0,
                    },
                    null
                );
            }

            const indexStart = elementByPage * params.page;
            if (offers.length < indexStart) {
                return new Result<PageOffers>(ResultType.SUCCESS, 204, "[GetOffersFromSearch] The page requested doesn't exists.", null, null);
            }

            const indexEnd = elementByPage * (params.page + 1);
            const resultByPage = offers.slice(indexStart, indexEnd);
            const maxPage = offers.length % elementByPage;
            return new Result<PageOffers>(
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
            return new Result<PageOffers>(ResultType.FAILURE, 500, "[GetOffersFromSearch] An exception has been throw. Check logs.", null, err);
        }
    }
}

const elementByPage: number = 20;
interface GetOffersFromSearchParams {
    keywords: string | null;
    codeZone: string | null;
    distance: number | null;
    page: number | null;
}
