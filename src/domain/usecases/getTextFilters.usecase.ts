import { Result, Usecase } from "@App/core/usecase"
import { UUID } from "crypto"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "@App/infrastructure/datasources/local/textFilter.datasource"
import { TextFilter } from "../entities/textFilter.entity"

export interface GetSchoolsUsecase extends Usecase<TextFilter[], GetSchoolsUsecaseParams> {
    schoolDatasource: TextFilterDatasource
}

export const getSchoolsUsecaseImpl: GetSchoolsUsecase = {
    schoolDatasource: TextFilterDatasourceImpl,
    perform: function (params: GetSchoolsUsecaseParams): Promise<Result<TextFilter[]>> {
        params.ids
        throw new Error("Function not implemented.")
    },
}

export interface GetSchoolsUsecaseParams {
    ids?: string[]
    names?: string[]
}
