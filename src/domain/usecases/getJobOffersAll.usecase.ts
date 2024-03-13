import { Failure, Result, Success, Usecase } from "@App/core/usecase"
import { GetJobOfferFTUsecase, GetJobOfferFTUsecaseImpl } from "./getJobOffersFT.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseImpl } from "./getJobOffersWTTJ.usecase"
import { JobOffer } from "../entities/jobOffer.entity"
import { logger } from "@App/core/tools/logger"

export interface GetJobOffersAllUsecase extends Usecase<JobOffer[], Params> {
    getJobOfferFTUsecase: GetJobOfferFTUsecase
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase
}

export const GetJobOffersUsecaseImpl: GetJobOffersAllUsecase = {
    getJobOfferFTUsecase: GetJobOfferFTUsecaseImpl,
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecaseImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const [jobOffersFTResult, jobOffersWTTJResult] = await Promise.all([
                this.getJobOfferFTUsecase.perform(params),
                this.getJobOffersWTTJUsecase.perform(params),
            ])

            if (jobOffersFTResult instanceof Failure && jobOffersWTTJResult instanceof Failure) {
                return new Failure({
                    message: "Une erreur s'est produite lors de la récupération des données",
                    errorCode: 500,
                })
            }

            const jobOffers: JobOffer[] = []

            if (jobOffersFTResult instanceof Success) {
                jobOffers.push(...jobOffersFTResult.data)
            }

            if (jobOffersWTTJResult instanceof Success) {
                jobOffers.push(...jobOffersWTTJResult.data)
            }

            return new Success({
                message: "Job offers from findy API fetched successfully",
                data: jobOffers,
            })
        } catch (error) {
            logger.error("[GetJobOffersAllUsecase]", error)
            return new Failure({
                message: "Une erreur interne s'est produite sur le serveur",
                errorCode: 500,
            })
        }
    },
}

interface Params {
    keyWords: string
    cityCode: string
    page: number
    radius: number
}
