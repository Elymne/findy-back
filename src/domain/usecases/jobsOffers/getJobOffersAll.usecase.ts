import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import { GetJobOffersWTTJUsecase, GetJobOffersWTTJUsecaseImpl } from "./getJobOffersWTTJ.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import logger from "@App/core/tools/logger"
import { GetJobOffersHWUsecase, GetJobOffersHWUsecaseImpl } from "./getJobOffersHW.usecase"
import { GetJobOffersIndeedUsecase, GetJobOffersIndeedUsecaseimpl } from "./getJobOffersIndeed.usecase"

export interface GetJobOffersAllUsecase extends Usecase<JobOffer[], Params> {
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecase
    getJobOffersHWUsecase: GetJobOffersHWUsecase
    getJobOffersIndeedUsecase: GetJobOffersIndeedUsecase
}

export const GetJobOffersUsecaseImpl: GetJobOffersAllUsecase = {
    getJobOffersWTTJUsecase: GetJobOffersWTTJUsecaseImpl,
    getJobOffersHWUsecase: GetJobOffersHWUsecaseImpl,
    getJobOffersIndeedUsecase: GetJobOffersIndeedUsecaseimpl,
    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const [jobOffersWTTJResult, jobOffersHWResult, jobOffersIndeedResult] = await Promise.all([
                this.getJobOffersWTTJUsecase.perform(params),
                this.getJobOffersHWUsecase.perform(params),
                this.getJobOffersIndeedUsecase.perform(params),
            ])

            if (
                jobOffersWTTJResult instanceof Failure &&
                jobOffersHWResult instanceof Failure &&
                jobOffersIndeedResult instanceof Failure
            ) {
                return new Failure({
                    message: "Une erreur s'est produite lors de la récupération des données",
                    errorCode: 500,
                })
            }

            const jobOffers: JobOffer[] = []

            if (jobOffersWTTJResult instanceof Success) {
                jobOffers.push(...jobOffersWTTJResult.data)
            }

            if (jobOffersHWResult instanceof Success) {
                jobOffers.push(...jobOffersHWResult.data)
            }

            if (jobOffersIndeedResult instanceof Success) {
                jobOffers.push(...jobOffersIndeedResult.data)
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
