import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import { MysqlDatabase } from "./db/MysqlDatabase"
import { RowDataPacket } from "mysql2"
import Job from "@App/domain/models/clean/Job.model"

export default class JobLocalDatasource implements JobLocalRepository {
    async findOne(id: string): Promise<Job | undefined> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<JobResult[]>("SELECT * FROM job WHERE id = ?", [id])
        if (result.length == 0) {
            return undefined
        }
        return parse(result[0])
    }

    async findAll(): Promise<Job[]> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<JobResult[]>("SELECT * FROM job")
        return result.map((elem) => parse(elem))
    }

    async deleteAll(): Promise<void> {
        MysqlDatabase.getInstance().getConnec().query("DELETE FROM job")
    }

    async createAll(jobs: Job[]): Promise<void> {
        const query = "INSERT INTO job(id, title) VALUES ?"
        const values = jobs.map((elem) => {
            return [elem.id, elem.title]
        })

        MysqlDatabase.getInstance().getConnec().query(query, [values])
    }

    async createOne(job: Job): Promise<void> {
        const query = "INSERT INTO job(id, title) VALUES (?)"
        const values = [job.id, job.title]
        MysqlDatabase.getInstance().getConnec().query(query, values)
    }
}

interface JobResult extends RowDataPacket {
    id: string
    title: string
}

function parse(jobLocalModel: JobResult): Job {
    return {
        id: jobLocalModel.id,
        title: jobLocalModel.title,
    }
}
