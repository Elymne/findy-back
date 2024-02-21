import { Failure, Result, Success, UsecaseNoParams } from "~/core/usecase"
import { Municipality } from "../entities/municipality.entity"
import { MunicipalityFTDatasource, MunicipalityFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/municipalityFT.datasource"
import { MunicipalityParser, MunicipalityParserImpl } from "~/infrastructure/parser/municipality.parser"
import { TokenFTDatasource, TokenFTDatasourceImpl } from "~/infrastructure/datasources/ftapi/tokken.datasource"
import { logger } from "~/core/tools/logger"

export interface GetMunicipalities extends UsecaseNoParams<Municipality[]> {
    tokenFTDatasource: TokenFTDatasource
    municipalityFTDatasource: MunicipalityFTDatasource
    municipalityParser: MunicipalityParser
}

export const GetMunicipalitiesImpl: GetMunicipalities = {
    tokenFTDatasource: TokenFTDatasourceImpl,
    municipalityFTDatasource: MunicipalityFTDatasourceImpl,
    municipalityParser: MunicipalityParserImpl,

    perform: async function (): Promise<Result<Municipality[]>> {
        try {
            const token = await this.tokenFTDatasource.generate()
            const ftMunicipalities = await this.municipalityFTDatasource.findAll(token)
            const municipalities = await this.municipalityParser.parseFT(ftMunicipalities)

            return {
                message: "Municipalities from france.travail API fetched successfully",
                data: municipalities,
            } as Success<Municipality[]>
        } catch (error) {
            logger.error(error)
            return {
                message: "An internal error occur",
                data: [],
                errorCode: 1,
            } as Failure<Municipality[]>
        }
    },
}
