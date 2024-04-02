import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import { CityWithCoordinates } from "@App/domain/entities/city.entity"
import GeoapiDatasource, { GeoapiDatasourceImpl } from "@App/infrastructure/remote/geoapi/geoapiDatasource"

export default interface GetOneCityByCodeUsecase extends Usecase<CityWithCoordinates, Params> {
    geoapiDatasource: GeoapiDatasource
}

export const GetOneCityByCodeUsecaseImpl: GetOneCityByCodeUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,

    perform: async function (params: Params): Promise<Result<CityWithCoordinates>> {
        try {
            const city = await this.geoapiDatasource.findOneByCode(params.code)

            return new Success({
                message: `The city with code ${params.code} does exists in geo.api.`,
                data: city,
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

type Params = {
    code: string
}
