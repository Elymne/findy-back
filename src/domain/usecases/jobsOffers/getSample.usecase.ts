import logger from "@App/core/tools/logger"
import SamplejobOffers from "../../entities/sampleJobOffer"
import { Failure, Result, Success, UsecaseNoParams } from "../../../core/interfaces/abstract.usecase"
import { GetPageOffersWTTJUsecase, GetPageOffersWTTJUSecaseImpl } from "./getPageOffersWTTJ.usecase"

export interface GetSampleUsecase extends UsecaseNoParams<SamplejobOffers> {
    getJobOffersWTTJUsecase: GetPageOffersWTTJUsecase
}

export const GetSampleUsecaseImpl: GetSampleUsecase = {
    getJobOffersWTTJUsecase: GetPageOffersWTTJUSecaseImpl,

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

            const sampleJobOffers: SamplejobOffers = {
                marketing: buffer[0].data.jobOffers.slice(0, 4),
                communication: buffer[1].data.jobOffers.slice(0, 4),
                comptability: buffer[2].data.jobOffers.slice(0, 4),
                webDev: buffer[3].data.jobOffers.slice(0, 4),
                humanResources: buffer[4].data.jobOffers.slice(0, 4),
                commercial: buffer[5].data.jobOffers.slice(0, 4),
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
