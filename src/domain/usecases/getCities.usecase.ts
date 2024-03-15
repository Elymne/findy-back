import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { MunicipalityParser, MunicipalityParserImpl } from "@App/infrastructure/parser/municipality.parser"
import { logger } from "@App/core/logger"
import { City } from "@App/domain/entities/city.entity"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "./getFTToken.usecase"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    getTokenFTUsecase: GetTokenFTUsecase
    municipalityFTDatasource: CityFTDatasource
    municipalityParser: MunicipalityParser
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    getTokenFTUsecase: GetTokenFTUsecaseImpl,
    municipalityFTDatasource: CityFTDatasourceImpl,
    municipalityParser: MunicipalityParserImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const tokenResult = await this.getTokenFTUsecase.perform()
            if (tokenResult instanceof Failure) return tokenResult

            const municipalitiesRawData = await this.municipalityFTDatasource.findAll(tokenResult.data!)
            const municipalitiesData = await this.municipalityParser.parseFT(municipalitiesRawData)

            return new Success({
                message: "Municipalities from france.travail API fetched successfully",
                data: municipalitiesData,
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
