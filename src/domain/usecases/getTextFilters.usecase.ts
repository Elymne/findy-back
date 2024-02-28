import { Result, Usecase } from "~/core/usecase"
import { UUID } from "crypto"
import { TextFilterDatasource, TextFilterDatasourceImpl } from "~/infrastructure/datasources/local/textFilter.datasource"
import { TextFilter } from "../entities/databases/textFilter.entity"

export interface GetSchoolsUsecase extends Usecase<TextFilter[], GetSchoolsUsecaseParams> {
    schoolDatasource: TextFilterDatasource
}

export const getSchoolsUsecaseImpl: GetSchoolsUsecase = {
    schoolDatasource: TextFilterDatasourceImpl,
    perform: function (params: GetSchoolsUsecaseParams): Promise<Result<TextFilter[]>> {
        throw new Error("Function not implemented.")
    },
}

export interface GetSchoolsUsecaseParams {
    ids?: UUID[]
    names?: string[]
}
