import Job from "@App/domain/models/Job.model"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import db from "./db/db"
import { JobCreate } from "./tables/job_table"

export default class JobLocalDatasource implements JobLocalRepository {
    async findOne(id: string): Promise<Job | undefined> {
        const result = await db.selectFrom("job").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) {
            return undefined
        }

        return {
            id: result.id,
            title: result.title,
        }
    }

    async findAll(): Promise<Job[]> {
        const results = await db.selectFrom("job").selectAll().execute()
        return results.map((result) => {
            return {
                id: result.id,
                title: result.title,
            }
        })
    }

    async deleteAll(): Promise<void> {
        db.deleteFrom("company").execute()
    }

    async createAll(jobs: Job[]): Promise<void> {
        const jobsTable: JobCreate[] = jobs.map((company) => {
            return {
                id: company.id!,
                title: company.title!,
            }
        })

        await db.insertInto("job").values(jobsTable).execute()
    }

    async createOne(job: Job): Promise<void> {
        const jobTable: JobCreate = {
            id: job.id!,
            title: job.title!,
        }
        await db.insertInto("job").values(jobTable).execute()
    }
}
