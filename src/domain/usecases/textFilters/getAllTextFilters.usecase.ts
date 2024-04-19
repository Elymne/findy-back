import { Failure, Result, Success, UsecaseNoParams } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import TextFilter from "@App/domain/entities/textFilter.entity"
import TextFilterDatasource, { TextFilterDatasourceImpl } from "@App/infrastructure/local/mongoDb/textFilter.datasource"

export default interface GetAllTextFiltersUsecase extends UsecaseNoParams<TextFilter[]> {
    textFilterDatasource: TextFilterDatasource
}

export const GetAllTextFiltersUsecaseImpl: GetAllTextFiltersUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,

    perform: async function (): Promise<Result<TextFilter[]>> {
        try {
            const result = await this.textFilterDatasource.findAll()
            return new Success({
                data: result,
                message: "Text filters from database fetched successfully",
            })
        } catch (error) {
            logger.error("[GetAllTextFiltersUsecase]", error)
            return new Failure({
                message: "Internal Error occured while fetching data",
                errorCode: 500,
            })
        }
    },
}
