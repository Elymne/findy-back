import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import KyselyDatabase from "./db/KyselyDatabase"
import { JobCreate } from "./tables/job_table"
import Job from "@App/domain/models/clean/Job.model"
import { injectable } from "tsyringe"

@injectable()
export default class JobLocalDatasource implements JobLocalRepository {
    private kyselyDatabase: KyselyDatabase

    constructor(kyselyDatabase: KyselyDatabase) {
        this.kyselyDatabase = kyselyDatabase
    }

    async findOne(id: string): Promise<Job | undefined> {
        const result = await this.kyselyDatabase.connec.selectFrom("job").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            title: result.title,
        }
    }

    async findAll(): Promise<Job[]> {
        const results = await this.kyselyDatabase.connec.selectFrom("job").selectAll().execute()
        return results.map((result) => {
            return {
                id: result.id,
                title: result.title,
            }
        })
    }

    async deleteAll(): Promise<void> {
        await this.kyselyDatabase.connec.deleteFrom("company").execute()
    }

    async createAll(jobs: Job[]): Promise<void> {
        if (jobs.length == 0) {
            return
        }

        const jobsParsed: JobCreate[] = jobs.map((company) => {
            return {
                id: company.id,
                title: company.title,
            }
        })

        await this.kyselyDatabase.connec.insertInto("job").values(jobsParsed).execute()
    }

    async createOne(job: Job): Promise<void> {
        const jobTable: JobCreate = {
            id: job.id,
            title: job.title,
        }
        await this.kyselyDatabase.connec.insertInto("job").values(jobTable).execute()
    }
}
