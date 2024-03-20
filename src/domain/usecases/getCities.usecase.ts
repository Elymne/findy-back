import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { CityFTDatasource, CityFTDatasourceImpl } from "@App/infrastructure/franceTravail/datasources/cityFT.datasource"
import { CityFTParser, CityFTParserImpl } from "@App/infrastructure/franceTravail/parsers/cityFT.parser"
import { logger } from "@App/core/logger"
import { City } from "@App/domain/entities/city.entity"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "./getFTToken.usecase"
import { CityService, CityServiceImpl } from "@App/infrastructure/franceTravail/services/city.service"

export interface GetCitiesUsecase extends UsecaseNoParams<City[]> {
    getTokenFTUsecase: GetTokenFTUsecase
    cityFTDatasource: CityFTDatasource
    cityFTParser: CityFTParser
    cityService: CityService
}

export const GetCitiesUsecaseImpl: GetCitiesUsecase = {
    getTokenFTUsecase: GetTokenFTUsecaseImpl,
    cityFTDatasource: CityFTDatasourceImpl,
    cityFTParser: CityFTParserImpl,
    cityService: CityServiceImpl,

    perform: async function (): Promise<Result<City[]>> {
        try {
            const tokenResult = await this.getTokenFTUsecase.perform()
            if (tokenResult instanceof Failure) return tokenResult

            const citiesRawData = await this.cityFTDatasource.findAll(tokenResult.data!)
            const cityData = await this.cityFTParser.parseFT(citiesRawData)
            const cityDataFiltered = await this.cityService.filter(cityData)

            return new Success({
                message: "Cities (municipalities) from france.travail API fetched successfully",
                data: cityDataFiltered,
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
