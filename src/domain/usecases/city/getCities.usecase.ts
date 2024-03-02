import { Failure, Result, Success, UsecaseNoParams } from "@App/core/usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { MunicipalityParser, MunicipalityParserImpl } from "@App/infrastructure/parser/municipality.parser"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "@App/infrastructure/datasources/ftapi/tokkenFT.datasource"
import { logger } from "@App/core/tools/logger"
import { City } from "@App/domain/entities/city.entity"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    tokenFTDatasource: TokenFTDatasource
    municipalityFTDatasource: CityFTDatasource
    municipalityParser: MunicipalityParser
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    municipalityFTDatasource: CityFTDatasourceImpl,
    municipalityParser: MunicipalityParserImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const token = await this.tokenFTDatasource.generate()
            const ftMunicipalities = await this.municipalityFTDatasource.findAll(token)
            const municipalities = await this.municipalityParser.parseFT(ftMunicipalities)

            return {
                message: "Municipalities from france.travail API fetched successfully",
                data: municipalities,
            } as Success<City[]>
        } catch (error) {
            logger.error(error)
            return {
                message: "An internal error occur",
                data: [],
                errorCode: 500,
            } as Failure<City[]>
        }
    },
}
