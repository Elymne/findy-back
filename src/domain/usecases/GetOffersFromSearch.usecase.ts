import { Result, ResultType, Usecase } from "@App/core/usecase";
import Offers from "../models/Offers.model";
import OfferRepository from "../repositories/Offer.repository";
import ZoneRepository from "../repositories/Zone.repository";
import { Container } from "../di/Container";
import { Respositories } from "../di/Injectable";

interface GetOffersFromSearchParams {
    keywords: string;
    codeZone: string;
    distance: number;
    page: number;
}

const elementByPage: number = 20;

export default interface GetOffersFromSearch extends Usecase<Offers, GetOffersFromSearchParams> {
    offerRepository: OfferRepository;
    zoneRepository: ZoneRepository;
}

export const GetOffersFromSearchImpl: GetOffersFromSearch = {
    offerRepository: Container.get<OfferRepository>(Respositories.OfferRepository),
    zoneRepository: Container.get<ZoneRepository>(Respositories.ZoneRepository),

    perform: async function (params: GetOffersFromSearchParams): Promise<Result<Offers>> {
        try {
            const offers = await this.offerRepository.findManyBySearch(params.keywords, params.codeZone, params.distance);
            if (offers.length == 0) {
                return {
                    type: ResultType.SUCCESS,
                    logMessage: "[GetOffersFromSearch] No offers found.",
                    data: null,
                    exception: null,
                };
            }

            const indexStart = elementByPage * params.page;
            if (offers.length < indexStart) {
                return {
                    type: ResultType.FAILURE,
                    logMessage: "[GetOffersFromSearch] The page requested doesn't exists.",
                    exception: null,
                    data: null,
                };
            }

            const indexEnd = elementByPage * (params.page + 1);
            const resultByPage = offers.slice(indexStart, indexEnd);
            const maxPage = offers.length % elementByPage;
            return {
                type: ResultType.SUCCESS,
                logMessage: "[GetOffersFromSearch] Offers founded successfully.",
                data: {
                    jobs: resultByPage,
                    currentPage: params.page,
                    maxPage: maxPage,
                },
                exception: null,
            };
        } catch (err) {
            return {
                type: ResultType.FAILURE,
                logMessage: "[GetOffersFromSearch] An exception has been throw. Check logs.",
                exception: err,
                data: null,
            };
        }
    },
};
