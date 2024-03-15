import { Failure, Result, Success, UsecaseNoParams } from "@App/domain/usecases/abstract.usecase"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/local/datasources/textFilter.datasource"
import { TextFilter } from "../entities/textFilter.entity"
import { logger } from "@App/core/logger"

export interface GetTextFiltersUsecase extends UsecaseNoParams<TextFilter[]> {
    textFilterDatasource: TextFilterDatasource
}

export const GetTextFiltersUsecaseImpl: GetTextFiltersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,

    perform: async function (): Promise<Result<TextFilter[]>> {
        try {
            const result = await this.textFilterDatasource.findAll()

            return new Success({
                message: "TextFilters data has been successfully fetched from server.",
                data: result,
            })
        } catch (error) {
            logger.error("[GetTextFiltersUsecase]", error)
            return new Failure({
                message: "An error occured from server",
                errorCode: 500,
            })
        }
    },
}
