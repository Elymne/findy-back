import logger from "@App/core/tools/logger"
import SamplejobOffers from "../../entities/sampleJobOffer"
import { Failure, Result, Success, UsecaseNoParams } from "../../../core/interfaces/abstract.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseImpl } from "./getJobOffersWTTJ.usecase"

export interface GetSampleUsecase extends UsecaseNoParams<SamplejobOffers> {
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase
}

export const GetSampleUsecaseImpl: GetSampleUsecase = {
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecaseImpl,

    perform: async function (): Promise<Result<SamplejobOffers>> {
        try {
            const fetchers = ["marketing", "communication", "comptabilité", "dévelopement web", "rh", "commercial"]
            const buffer = await Promise.all(
                fetchers.map((fetcher) => {
                    return this.getJobOffersWTTJUsecase.perform({
                        keyWords: fetcher,
                        nbElements: 8,
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
