import Job from "../models/Job.model"

/**
 * Only one implementation of this repository should be done.
 * Should be used to fetch data from an external datasource.
 *
 * @function findAll():Promise<Job[]>
 */
/**
 * Interface that dictate what our remote jobs datasource can do to four our usecases.
 * This should be implemented and used by only one datasource class at runtime unless we want to have multiple local datasource.
 */
export default interface JobRemoteRepository {
    /**
     * Fetch all data about Job type from a external datasource and return it.
     */
    findAll(): Promise<Job[]>
}
