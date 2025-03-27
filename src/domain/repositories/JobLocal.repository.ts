import Job from "../models/Job.model"

/**
 * Interface that dictate what our local jobs datasource can do to four our usecases.
 * This should be implemented and used by only one datasource class at runtime unless we want to have multiple local datasource.
 */
export default interface JobLocalRepository {
    /**
     * Allow us to fetch one precise data to our data source.
     * If data does not exists, it should just return an undefined value.
     * @param {string} id
     * @return {Promise<Job | undefined>}
     */
    findOne(id: string): Promise<Job | undefined>

    /**
     * Allow us to fetch all job that can exisst in the context of our API.
     * One usecase
     * @return {Promise<Job[]>}
     */
    findAll(): Promise<Job[]>

    /**
     * This will be used to delete all data from the local datasource.
     * This shoudl be used when you need to reset all your data for reseting purpose for example.
     */
    deleteAll(): Promise<void>

    /**
     * This will be used to refill our data source with a new set of data.
     * If you want to add custom Job, then use @function createOne function.
     * @param {Job[]} jobs Data from external datasource
     */
    storeAll(jobs: Job[]): Promise<void>

    /**
     * This can be used when you need to add a custom job data.
     * Example : I need a new type of Job that doesn't exists in the external datasource of job that I use for my API.
     * @param {Job} job Custom Data that you have created.
     */
    storeUnique(job: Job): Promise<void>
}
