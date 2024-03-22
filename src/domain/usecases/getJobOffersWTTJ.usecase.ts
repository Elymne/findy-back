import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "./getOneCity.usecase"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import { Failure, Result, Success, Usecase } from "./abstract.usecase"
import JobOffer from "../entities/jobOffer.entity"
import logger from "@App/core/logger"
import {
    JobOfferWTTJDatasource,
    JobOfferWTTJDatasourceImpl,
} from "@App/infrastructure/remote/welcomeToTheJungle/datasources/jobOfferWTTJ.datasource"

type Params = {
    keyWords: string
    cityCode?: string
    page?: number
    radius?: number
    nbElements?: number
}

export interface GetJobOffersWTTJUsecase extends Usecase<JobOffer[], Params> {
    jobOfferWTTJDatasource: JobOfferWTTJDatasource

    getOneCity: GetOneCityUsecase
    filterJobUsecase: FilterJobOffersUsecase
}

export const GetJobOffersWTTJUsecaseImpl: GetJobOffersWTTJUsecase = {
    jobOfferWTTJDatasource: JobOfferWTTJDatasourceImpl,

    getOneCity: GetOneCityUsecaseImpl,
    filterJobUsecase: FilterJobOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<JobOffer[]>> {
        try {
            const cityResult = await this.getOneCity.perform({ code: params.cityCode })
            if (cityResult instanceof Failure) return cityResult

            const jobOffers = await this.jobOfferWTTJDatasource.findAllByQuery({
                keyWords: params.keyWords,
                page: params.page,
                radius: params.radius,
                lat: cityResult.data.coordinates.lat,
                lng: cityResult.data.coordinates.lng,
                nbElement: params.nbElements,
            })

            const jobOffersFilteredResult = await this.filterJobUsecase.perform({ sources: jobOffers })
            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from WelcomeToTheJungle page fetched successfully",
                data: jobOffersFilteredResult.data,
            })
        } catch (error) {
            logger.error("[GetJobOffersWTTJUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
