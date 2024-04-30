import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import GetPageOffersWTTJUsecase, { GetPageOffersWTTJUSecaseImpl } from "./getPageOffersWTTJ.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import logger from "@App/core/tools/logger"
import GetPageOffersHWUsecase, { GetPageOffersHWUsecaseImpl } from "./getPageOffersHW.usecase"
import GetPageOffersIndeedUsecase, { GetPageOffersIndeedUsecaseImpl } from "./getPageOffersIndeed.usecase"
import PageOffers from "@App/domain/entities/pageResult.entity"

type Params = {
    keyWords: string
    cityCode: string
    page: number
    radius: number
}

export default interface GetPageOffersUsecase extends Usecase<PageOffers, Params> {
    getPageOffersWTTJUsecase: GetPageOffersWTTJUsecase
    getPageOffersHWUsecase: GetPageOffersHWUsecase
    getPageOffersIndeedUsecase: GetPageOffersIndeedUsecase
}

export const GetPageOffersUsecaseImpl: GetPageOffersUsecase = {
    getPageOffersWTTJUsecase: GetPageOffersWTTJUSecaseImpl,
    getPageOffersHWUsecase: GetPageOffersHWUsecaseImpl,
    getPageOffersIndeedUsecase: GetPageOffersIndeedUsecaseImpl,
    perform: async function (params: Params): Promise<Result<PageOffers>> {
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

            const mergedJobOffers = Array<JobOffer>()

            if (pageOffersWTTJResult instanceof Success) {
                mergedJobOffers.push(...pageOffersWTTJResult.data.jobOffers)
            }

            if (pageOffersHWResult instanceof Success) {
                mergedJobOffers.push(...pageOffersHWResult.data.jobOffers)
            }

            if (pageOffersIndeedResult instanceof Success) {
                mergedJobOffers.push(...pageOffersIndeedResult.data.jobOffers)
            }

            const totalPageNumberHW = (pageOffersHWResult as Success<PageOffers>).data.totalPagesNb
            const totalPagesNb = totalPageNumberHW > 8 ? 8 : totalPageNumberHW

            const pageOffers: PageOffers = {
                totalPagesNb: totalPagesNb,
                jobOffers: mergedJobOffers,
            }

            return new Success({
                message: "Job offers from findy API fetched successfully",
                data: pageOffers,
            })
        } catch (error) {
            logger.error("[GetPageOffersUsecase]", error)
            return new Failure({
                message: "Une erreur interne s'est produite sur le serveur",
                errorCode: 500,
            })
        }
    },
}
