import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "./getJobOffersFT.usecase"
import { logger } from "@App/core/logger"
import { SamplejobOffers } from "../entities/sampleJobOffer"

export interface GetSampleFromFTUsecase extends UsecaseNoParams<SamplejobOffers> {
    getJobOfferFTUsecase: GetJobOfferFTUsecase
}

export const GetSampleFromFTUsecaseImpl: GetSampleFromFTUsecase = {
    getJobOfferFTUsecase: GetJobOfferFTUsecaseImpl,
    perform: async function (): Promise<Result<SamplejobOffers>> {
        try {
            const fetchers = ["marketing", "communication", "comptabilité", "dévelopement web", "rh", "commercial"]

            const buffer = await Promise.all(
                fetchers.map((fetcher) => {
                    return this.getJobOfferFTUsecase.perform({
                        keyWords: fetcher,
                        cityCode: "75107",
                        page: 1,
                        radius: 20,
                    })
                })
            )

            return new Success({
                message: "the sample of job offers from france.travail has been fetched successfully",
                data: {
                    marketing: buffer[0].data.slice(0, 4),
                    communication: buffer[1].data.slice(0, 4),
                    comptability: buffer[2].data.slice(0, 4),
                    webDev: buffer[3].data.slice(0, 4),
                    humanResources: buffer[4].data.slice(0, 4),
                    commercial: buffer[5].data.slice(0, 4),
                },
            })
        } catch (error) {
            logger.error("[GetSampleFromFTUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
