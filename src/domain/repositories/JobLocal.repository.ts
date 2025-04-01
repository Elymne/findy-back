import Job from "../models/Job.model"

export default interface JobLocalRepository {
    findOne(id: string): Promise<Job | undefined>
    findAll(): Promise<Job[]>
    deleteAll(): Promise<void>
    createAll(jobs: Job[]): Promise<void>
    createOne(job: Job): Promise<void>
}
