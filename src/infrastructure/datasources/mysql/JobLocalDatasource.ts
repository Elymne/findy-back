import Job from "@App/domain/models/Job.model"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import { MysqlDatabase } from "./MysqlDatabase"
import { RowDataPacket } from "mysql2"

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
        const [result] = await MysqlDatabase.getInstance().getConnec().query<JobTable[]>("SELECT * FROM job WHERE id = ?", [id])
        if (result.length == 0) {
            return undefined
        }
        return parse(result[0])
    }

    /**
     * Fetch all data thta we can from our local datasource.
     * @return {Promise<Job[]>}
     */
    async findAll(): Promise<Job[]> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<JobTable[]>("SELECT * FROM job")
        return result.map((elem) => parse(elem))
    }

    /**
     * Simply clear all job data to the local datsource.
     * @return {Promise}
     */
    async deleteAll(): Promise<void> {
        MysqlDatabase.getInstance().getConnec().query("DELETE FROM job")
    }

    /**
     * Store a list of jobs to our local datasource.
     * @param {Job[]} jobs
     */
    async storeAll(jobs: Job[]): Promise<void> {
        const query = "INSERT INTO job(id, title) VALUES ?"
        const values = jobs.map((elem) => {
            return [elem.id, elem.title]
        })

        MysqlDatabase.getInstance().getConnec().query(query, [values])
    }

    /**
     * Store a unique job to our local datasource.
     * @param {Job} job
     * @return {Promise}
     */
    async storeUnique(job: Job): Promise<void> {
        const query = "INSERT INTO job(id, title) VALUES (?)"
        const values = [job.id, job.title]
        MysqlDatabase.getInstance().getConnec().query(query, values)
    }
}

interface JobTable extends RowDataPacket {
    id: string
    title: string
}

/**
 * @param {JobLocalModel} jobLocalModel
 * @returns {Job}
 */
function parse(jobLocalModel: JobTable): Job {
    return {
        id: jobLocalModel.id,
        title: jobLocalModel.title,
    }
}
