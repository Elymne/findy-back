import { Result, Usecase } from "~/core/usecase"
import { School } from "../entities/School.entity"
import { UUID } from "crypto"
import { SchoolDatasource, SchoolDatasourceImpl } from "~/infrastructure/datasources/local/school.datasource"

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
