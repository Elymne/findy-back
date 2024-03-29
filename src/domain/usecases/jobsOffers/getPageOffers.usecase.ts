import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import { GetPageOffersWTTJUsecase, GetPageOffersWTTJUSecaseImpl } from "./getPageOffersWTTJ.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import logger from "@App/core/tools/logger"
import { GetPageOffersHWUsecase, GetPageOffersHWUsecaseImpl } from "./getPageOffersHW.usecase"
import { GetPageOffersIndeedUsecase, GetPageOffersIndeedUsecaseImpl } from "./getPageOffersIndeed.usecase"

export interface GetPageOffersUsecase extends Usecase<JobOffer[], Params> {
    getPageOffersWTTJUsecase: GetPageOffersWTTJUsecase
    getPageOffersHWUsecase: GetPageOffersHWUsecase
    getPageOffersIndeedUsecase: GetPageOffersIndeedUsecase
}

export const GetPageOffersUsecaseImpl: GetPageOffersUsecase = {
    getPageOffersWTTJUsecase: GetPageOffersWTTJUSecaseImpl,
    getPageOffersHWUsecase: GetPageOffersHWUsecaseImpl,
    getPageOffersIndeedUsecase: GetPageOffersIndeedUsecaseImpl,
    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const [pageOffersWTTJResult, pageOffersHWResult, pageOffersIndeedResult] = await Promise.all([
                this.getPageOffersWTTJUsecase.perform(params),
                this.getPageOffersHWUsecase.perform(params),
                this.getPageOffersIndeedUsecase.perform(params),
            ])

            if (
                pageOffersWTTJResult instanceof Failure &&
                pageOffersHWResult instanceof Failure &&
                pageOffersIndeedResult instanceof Failure
            ) {
                return new Failure({
                    message: "Une erreur s'est produite lors de la récupération des données",
                    errorCode: 500,
                })
            }

            const jobOffers: JobOffer[] = []

            if (pageOffersWTTJResult instanceof Success) {
                jobOffers.push(...pageOffersWTTJResult.data.jobOffers)
            }

            if (pageOffersHWResult instanceof Success) {
                jobOffers.push(...pageOffersHWResult.data.jobOffers)
            }

            if (pageOffersIndeedResult instanceof Success) {
                jobOffers.push(...pageOffersIndeedResult.data.jobOffers)
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
