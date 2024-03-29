import { GetOneCityUsecase, GetOneCityUsecaseImpl } from "../cities/getOneCity.usecase"
import { FilterJobOffersUsecase, FilterJobOffersUsecaseImpl } from "./filterJobOffers.usecase"
import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import {
    PageOffersWTTJDatasource,
    PageOffersWTTJDatasourceImpl,
    FindAllByQueryWTTJParams,
} from "@App/infrastructure/remote/welcomeToTheJungle/datasources/jobOfferWTTJ.datasource"
import PageResult from "@App/domain/entities/pageResult.entity"

export interface GetPageOffersWTTJUsecase extends Usecase<PageResult, Params> {
    pageOffersWTTJDatasource: PageOffersWTTJDatasource
    getOneCityUsecase: GetOneCityUsecase
    filterJobUsecase: FilterJobOffersUsecase
}

export const GetPageOffersWTTJUSecaseImpl: GetPageOffersWTTJUsecase = {
    pageOffersWTTJDatasource: PageOffersWTTJDatasourceImpl,
    getOneCityUsecase: GetOneCityUsecaseImpl,
    filterJobUsecase: FilterJobOffersUsecaseImpl,

    perform: async function (params: Params): Promise<Result<PageResult>> {
        try {
            const query = {
                keyWords: params.keyWords,
                page: params.page,
                radius: params.radius,
                nbElement: params.nbElements,
                lat: undefined,
                lng: undefined,
            } as FindAllByQueryWTTJParams

            if (params.cityCode) {
                const cityResult = await this.getOneCityUsecase.perform({ code: params.cityCode })
                if (cityResult instanceof Failure) return cityResult
                query.lat = cityResult.data.coordinates.lat
                query.lng = cityResult.data.coordinates.lng
            }

            const pageResult = await this.pageOffersWTTJDatasource.findAllByQuery(query)

            const jobOffersFilteredResult = await this.filterJobUsecase.perform({ sources: pageResult.jobOffers })
            if (jobOffersFilteredResult instanceof Failure) return jobOffersFilteredResult

            return new Success({
                message: "Job offers from WelcomeToTheJungle page fetched successfully",
                data: {
                    jobOffers: jobOffersFilteredResult.data,
                    totalPagesNb: pageResult.totalPagesNb,
                } as PageResult,
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
