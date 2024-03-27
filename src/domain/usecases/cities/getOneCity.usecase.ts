import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import { CityDetailed } from "../../entities/city.entity"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/remote/geoapi/datasources/geoapiDatasource"
import { GeoApiParser, GeoApiParserImpl } from "@App/infrastructure/remote/geoapi/parsers/geoApi.parser"

type Params = {
    code?: string
    name?: string
}

export interface GetOneCityUsecase extends Usecase<CityDetailed, Params> {
    geoapiDatasource: GeoapiDatasource
    geoCityParser: GeoApiParser
}

export const GetOneCityUsecaseImpl: GetOneCityUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,
    geoCityParser: GeoApiParserImpl,

    perform: async function (params: Params): Promise<Result<CityDetailed>> {
        try {
            if (params.code) {
                const geoCity = await this.geoapiDatasource.findOneByCode(params.code)
                if (!geoCity) {
                    return new Failure({
                        message: `The city with code ${params.code} does not exists in geo.api.`,
                        errorCode: 404,
                    })
                }

                const city = await this.geoCityParser.parseOne(geoCity)
                return new Success({
                    message: `The city with code ${params.code} does exists in geo.api.`,
                    data: city,
                })
            }

            if (params.name) {
                const geoCity = await this.geoapiDatasource.findOneByName(params.name)
                if (!geoCity) {
                    return new Failure({
                        message: `The city with name ${params.name} does not exists in geo.api.`,
                        errorCode: 404,
                    })
                }

                const city = await this.geoCityParser.parseOne(geoCity)
                return new Success({
                    message: `The city with name ${params.name} does exists in geo.api.`,
                    data: city,
                })
            }

            return new Failure({
                message: "A code or a name should be queried",
                errorCode: 400,
            })
        } catch (error) {
            logger.error("[GetOneCity]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
