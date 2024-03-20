import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/franceTravail/datasources/cityFT.datasource"
import { CityFTParser, CityFTParserImpl } from "@App/infrastructure/franceTravail/parsers/cityFT.parser"
import { logger } from "@App/core/logger"
import { City } from "@App/domain/entities/city.entity"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "./getFTToken.usecase"
import { CityFTService, CityFTServiceImpl } from "@App/infrastructure/franceTravail/services/cityFT.service"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    getTokenFTUsecase: GetTokenFTUsecase
    cityFTDatasource: CityFTDatasource
    cityFTParser: CityFTParser
    cityFTService: CityFTService
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    getTokenFTUsecase: GetTokenFTUsecaseImpl,
    cityFTDatasource: CityFTDatasourceImpl,
    cityFTParser: CityFTParserImpl,
    cityFTService: CityFTServiceImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const tokenResult = await this.getTokenFTUsecase.perform()
            if (tokenResult instanceof Failure) return tokenResult

            const citiesRawData = await this.cityFTDatasource.findAll(tokenResult.data!)
            const citiesRawDataFiltered = await this.cityFTService.filter(citiesRawData)
            const cityData = await this.cityFTParser.parseFT(citiesRawDataFiltered)

            return new Success({
                message: "Cities (municipalities) from france.travail API fetched successfully",
                data: cityData,
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
