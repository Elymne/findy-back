import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { logger } from "@App/core/logger"
import { City } from "@App/domain/entities/city.entity"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/geoapi/datasources/geoapiDatasource"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    geoapiDatasource: GeoapiDatasource
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
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
