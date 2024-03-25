import { Failure, Result, Success, UsecaseNoParams } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import City from "@App/domain/entities/city.entity"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/remote/geoapi/datasources/geoapiDatasource"
import { GeoApiParser, GeoApiParserImpl } from "@App/infrastructure/remote/geoapi/parsers/geoApi.parser"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    geoapiDatasource: GeoapiDatasource
    geoApiParse: GeoApiParser
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,
    geoApiParse: GeoApiParserImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const geoCities = await this.geoapiDatasource.findAll()
            const cities = await this.geoApiParse.parse(geoCities)

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
