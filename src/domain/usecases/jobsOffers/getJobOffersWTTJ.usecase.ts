import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import JobOffer from "../../entities/jobOffer.entity"
import logger from "@App/core/tools/logger"
import {
    JobOfferWTTJDatasource,
    JobOfferWTTJDatasourceImpl,
    JobOfferWTTJQuery,
} from "@App/infrastructure/remote/welcomeToTheJungle/datasources/jobOfferWTTJ.datasource"

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
            const query = {
                keyWords: params.keyWords,
                page: params.page,
                radius: params.radius,
                nbElement: params.nbElements,
                lat: undefined,
                lng: undefined,
            } as JobOfferWTTJQuery

            if (params.cityCode) {
                const cityResult = await this.getOneCity.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) return cityResult
                query.lat = cityResult.data.coordinates.lat
                query.lng = cityResult.data.coordinates.lng
            }

            const jobOffers = await this.jobOfferWTTJDatasource.findAllByQuery(query)

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

type Params = {
    keyWords: string
    cityCode?: string
    page?: number
    radius?: number
    nbElements?: number
}
