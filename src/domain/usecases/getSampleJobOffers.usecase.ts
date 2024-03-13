import { Failure, Result, Success, UsecaseNoParams } from "@App/core/usecase"
import { JobOffer } from "../entities/jobOffer.entity"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "./getJobOffersFT.usecase"
import { logger } from "@App/core/tools/logger"

export interface GetSampleJobOffersUsecase extends UsecaseNoParams<SamplejobOffers> {
    getJobOfferFTUsecase: GetJobOfferFTUsecase
}

export const GetSampleJobOffersUsecaseimpl: GetSampleJobOffersUsecase = {
    getJobOfferFTUsecase: GetJobOfferFTUsecaseImpl,
    perform: async function (): Promise<Result<SamplejobOffers>> {
        try {
            const buffer = await Promise.all([
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "marketing",
                    page: 1,
                    radius: 20,
                }),
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "communication",
                    page: 1,
                    radius: 20,
                }),
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "comptabilité",
                    page: 1,
                    radius: 20,
                }),
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "développement web",
                    page: 1,
                    radius: 20,
                }),
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "rh",
                    page: 1,
                    radius: 20,
                }),
                this.getJobOfferFTUsecase.perform({
                    cityCode: "75107",
                    keyWords: "commercial",
                    page: 1,
                    radius: 20,
                }),
            ])

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
            logger.error("[GetSampleJobOffersUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

interface SamplejobOffers {
    marketing: JobOffer[]
    communication: JobOffer[]
    comptability: JobOffer[]
    webDev: JobOffer[]
    humanResources: JobOffer[]
    commercial: JobOffer[]
}
