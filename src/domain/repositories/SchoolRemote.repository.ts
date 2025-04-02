import School from "../models/clean/School.model"

/**
 * We need to filters all offers from school data.
 * This interface should implemented by any Datasource that will provide us school data.
 */
export default interface SchoolRemoteRepository {
    findAll(): School[]
}
