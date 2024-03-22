import { Failure, Result, Success, Usecase } from "@App/domain/usecases/abstract.usecase"
import { logger } from "@App/core/logger"
import { GeoapiDatasource, GeoapiDatasourceImpl } from "@App/infrastructure/geoapi/datasources/geoapiDatasource"

export interface DoesCityExistsUsecase extends Usecase<boolean, _Params> {
    geoapiDatasource: GeoapiDatasource
}

export const DoesCityExistsUsecaseImpl: DoesCityExistsUsecase = {
    geoapiDatasource: GeoapiDatasourceImpl,

    perform: async function (params: _Params): Promise<Result<boolean>> {
        try {
            if (params.code) {
                const city = await this.geoapiDatasource.findOneByCode(params.code)
                if (!city) {
                    return new Success({
                        message: `The city with code ${params.code} does not exists in france.travail API.`,
                        data: false,
                    })
                }

                return new Success({
                    message: `The city with code ${params.code} does exists in france.travail API.`,
                    data: true,
                })
            }

            if (params.name) {
                const city = await this.geoapiDatasource.findOneByCode(params.name)
                if (!city) {
                    return new Success({
                        message: `The city with name ${params.name} does not exists in france.travail API.`,
                        data: false,
                    })
                }

                return new Success({
                    message: `The city with name ${params.name} does exists in france.travail API.`,
                    data: true,
                })
            }

            return new Failure({
                message: "A code or a name should be queried",
                errorCode: 400,
            })
        } catch (error) {
            logger.error("[GetJobOfferFTUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

type _Params = {
    code?: string
    name?: string
}
