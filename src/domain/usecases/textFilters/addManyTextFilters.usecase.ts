import { Failure, Result, Success, Usecase } from "@App/core/interfaces/abstract.usecase"
import logger from "@App/core/tools/logger"
import uuid from "@App/core/tools/uuid"
import TextFilter from "@App/domain/entities/textFilter.entity"
import TextFilterModel from "@App/infrastructure/local/mongoDb/models/textFilter.model"
import TextFilterDatasource, { TextFilterDatasourceImpl } from "@App/infrastructure/local/mongoDb/textFilter.datasource"

type AddManyTextFilterUsecaseParams = {
    values: string[]
}

export default interface AddManyTextFilterUsecase extends Usecase<TextFilter[], AddManyTextFilterUsecaseParams> {
    textFilterDatasource: TextFilterDatasource
}

export const AddManyTextFilterUsecaseimpl: AddManyTextFilterUsecase = {
    textFilterDatasource: TextFilterDatasourceImpl,

    perform: async function (params: AddManyTextFilterUsecaseParams): Promise<Result<TextFilter[]>> {
        try {
            const textFilters = params.values.map((value) => {
                return {
                    id: uuid(),
                    value: value,
                }
            })

            await this.textFilterDatasource.addAll(textFilters as TextFilterModel[])

            return new Success({
                message: "Data has been added to database successfully.",
                data: textFilters,
            })
        } catch (error) {
            logger.error("[AddManyTextFilterUsecase]", error)
            return new Failure({
                message: "An error occured to server while adding theses text filters.",
                errorCode: 500,
            })
        }
    },
}
