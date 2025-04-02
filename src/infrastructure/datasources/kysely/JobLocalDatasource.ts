import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import KyselyDatabase from "./db/KyselyDatabase"
import { JobCreate } from "./tables/job_table"
import Job from "@App/domain/models/clean/Job.model"

export default class JobLocalDatasource implements JobLocalRepository {
    async findOne(id: string): Promise<Job | undefined> {
        const result = await KyselyDatabase.get.connec.selectFrom("job").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            title: result.title,
        }
    }

    async findAll(): Promise<Job[]> {
        const results = await KyselyDatabase.get.connec.selectFrom("job").selectAll().execute()
        return results.map((result) => {
            return {
                id: result.id,
                title: result.title,
            }
        })
    }

    async deleteAll(): Promise<void> {
        await KyselyDatabase.get.connec.deleteFrom("company").execute()
    }

    async createAll(jobs: Job[]): Promise<void> {
        const jobsTable: JobCreate[] = jobs.map((company) => {
            return {
                id: company.id,
                title: company.title,
            }
        })

        await KyselyDatabase.get.connec.insertInto("job").values(jobsTable).execute()
    }

    async createOne(job: Job): Promise<void> {
        const jobTable: JobCreate = {
            id: job.id,
            title: job.title,
        }
        await KyselyDatabase.get.connec.insertInto("job").values(jobTable).execute()
    }
}
