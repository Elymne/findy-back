import logger from "@App/core/tools/logger"
import SamplejobOffers from "../../entities/sampleJobOffer"
import { Failure, Result, Success, UsecaseNoParams } from "../../../core/interfaces/abstract.usecase"
import PageOffersWTTJDatasource, {
    PageOffersWTTJDatasourceImpl,
} from "@App/infrastructure/remote/welcomeToTheJungle/jobOfferWTTJ.datasource"

export default interface GetSampleUsecase extends UsecaseNoParams<SamplejobOffers> {
    pageOffersWTTJDatasource: PageOffersWTTJDatasource
}

export const GetSampleUsecaseImpl: GetSampleUsecase = {
    pageOffersWTTJDatasource: PageOffersWTTJDatasourceImpl,

    perform: async function (): Promise<Result<SamplejobOffers>> {
        try {
            const fetchers = ["marketing", "communication", "comptabilité", "dévelopement web", "rh", "commercial"]

            const buffer = await Promise.all(
                fetchers.map((fetcher) => {
                    return this.pageOffersWTTJDatasource.findSample({
                        keyWords: fetcher,
                    })
                })
            )

            const sampleJobOffers: SamplejobOffers = {
                marketing: buffer[0].jobOffers.slice(0, 4),
                communication: buffer[1].jobOffers.slice(0, 4),
                comptability: buffer[2].jobOffers.slice(0, 4),
                webDev: buffer[3].jobOffers.slice(0, 4),
                humanResources: buffer[4].jobOffers.slice(0, 4),
                commercial: buffer[5].jobOffers.slice(0, 4),
            }

            return new Success({
                message: "The sample of job offers has been fetched successfully",
                data: sampleJobOffers,
            })
        } catch (error) {
            logger.error("[GetSampleUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
