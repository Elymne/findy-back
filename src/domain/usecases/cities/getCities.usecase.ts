import { Failure, Result, Success, UsecaseNoParams } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import City from "@App/domain/entities/city.entity"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/remote/geoapi/geoapiDatasource"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    geoapiDatasource: GeoapiDatasource
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const cities = await this.geoapiDatasource.findAll()

            return new Success({
                message: "Cities from geo.api fetched successfully !",
                data: cities,
            })
        } catch (error) {
            logger.error("[GetCitiesUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
