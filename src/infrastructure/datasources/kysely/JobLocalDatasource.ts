import Job from "@App/domain/models/Job.model"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import { JobLocalCreate, JobLocalModel } from "./tables/Job.table"
import { DB } from "./database"

/**
 * Implementation of JobLocalRepository to France Travail Jobs datasource.
 * This implementation use kysely lib to manage data.
 * To see what type of DB.instance.get is used, check DB.instance.get import.
 */
export default class JobLocalDatasource implements JobLocalRepository {
    /**
     * Fetch a unique Job from the local datasource.
     * @param {string} id
     * @return {Promise<Job | undefined>}
     */
    async findOne(id: string): Promise<Job | undefined> {
        const jobLocalModel = (await DB.getInstance().connec.selectFrom("job").where("id", "=", id).selectAll().executeTakeFirst()) as JobLocalModel
        if (!jobLocalModel) {
            return undefined
        }
        return parse(jobLocalModel)
    }

    /**
     * Fetch all data thta we can from our local datasource.
     * @return {Promise<Job[]>}
     */
    async findAll(): Promise<Job[]> {
        const jobsLocalModel = (await DB.getInstance().connec.selectFrom("job").selectAll().execute()) as JobLocalModel[]
        return jobsLocalModel.map((elem) => {
            return parse(elem)
        })
    }

    /**
     * Simply clear all job data to the local datsource.
     * @return {Promise}
     */
    async deleteAll(): Promise<void> {
        DB.getInstance().connec.deleteFrom("job").execute()
    }

    /**
     * Store a list of jobs to our local datasource.
     * @param {Job[]} jobs
     */
    async storeAll(jobs: Job[]): Promise<void> {
        DB.getInstance()
            .connec.insertInto("job")
            .values(jobs.map((elem) => parseCreate(elem)))
    }

    /**
     * Store a unique job to our local datasource.
     * @param {Job} job
     * @return {Promise}
     */
    async storeUnique(job: Job): Promise<void> {
        DB.getInstance().connec.insertInto("job").values(parseCreate(job))
    }
}

/**
 * @param {JobLocalModel} jobLocalModel
 * @returns {Job}
 */
function parse(jobLocalModel: JobLocalModel): Job {
    return {
        id: jobLocalModel.id,
        title: jobLocalModel.title,
    }
}

/**
 * @param {Job} job
 * @returns {JobLocalCreate}
 */
function parseCreate(job: Job): JobLocalCreate {
    return {
        id: job.id,
        title: job.title,
    }
}
