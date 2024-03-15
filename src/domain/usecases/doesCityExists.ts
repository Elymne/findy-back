import { Failure, Result, Success, Usecase } from "@App/domain/usecases/abstract.usecase"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "./getFTToken.usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { logger } from "@App/core/logger"

export interface DoesCityExistsUsecase extends Usecase<boolean, GetJobOfferFTUsecaseParams> {
    getTokenFTUsecase: GetTokenFTUsecase
    cityFTDatasource: CityFTDatasource
}

export const DoesCityExistsUsecaseImpl: DoesCityExistsUsecase = {
    getTokenFTUsecase: GetTokenFTUsecaseImpl,
    cityFTDatasource: CityFTDatasourceImpl,

    perform: async function (params: GetJobOfferFTUsecaseParams): Promise<Result<boolean>> {
        try {
            const tokenResult = await this.getTokenFTUsecase.perform()
            if (tokenResult instanceof Failure) {
                return tokenResult
            }

            const city = await this.cityFTDatasource.findOne(params.code, tokenResult.data!)
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
        } catch (error) {
            logger.error("[GetJobOfferFTUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}

interface GetJobOfferFTUsecaseParams {
    code: string
}
