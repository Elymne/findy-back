import { Result, Usecase } from "~/core/usecase"
import { UUID } from "crypto"
import { SchoolDatasource, SchoolDatasourceImpl } from "~/infrastructure/datasources/local/school.datasource"
import { School } from "../entities/school.entity"

export interface GetSchoolsUsecase extends Usecase<School[], GetSchoolsUsecaseParams> {
    schoolDatasource: SchoolDatasource
}

export const getSchoolsUsecaseImpl: GetSchoolsUsecase = {
    schoolDatasource: SchoolDatasourceImpl,
    perform: function (params: GetSchoolsUsecaseParams): Promise<Result<School[]>> {
        throw new Error("Function not implemented.")
    },
}

export interface GetSchoolsUsecaseParams {
    ids?: UUID[]
    names?: string[]
}
