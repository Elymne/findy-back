import { logger } from "@App/core/logger"
import { SamplejobOffers } from "../entities/sampleJobOffer"
import { Failure, Result, Success, UsecaseNoParams } from "./abstract.usecase"
import { GetJobOffersWTTJRangeUsecase, GetJobOffersWTTJRangeUsecaseImpl } from "./getJobOffersWTTJRange.usecase"

export interface GetSampleFromWTTJUsecase extends UsecaseNoParams<SamplejobOffers> {
    getJobOffersWTTJRangeUsecase: GetJobOffersWTTJRangeUsecase
}

export const GetSampleFromWTTJUsecaseImpl: GetSampleFromWTTJUsecase = {
    getJobOffersWTTJRangeUsecase: GetJobOffersWTTJRangeUsecaseImpl,

    perform: async function (): Promise<Result<SamplejobOffers>> {
        try {
            const fetchers = ["marketing", "communication", "comptabilité", "dévelopement web", "rh", "commercial"]
            const buffer = await Promise.all(
                fetchers.map((fetcher) => {
                    return this.getJobOffersWTTJRangeUsecase.perform({
                        keyWords: fetcher,
                        page: 1,
                        nb: 10,
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
            logger.error("[GetSampleFromWTTJUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
