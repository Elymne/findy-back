import Job from "../models/Job.model"

export default interface JobLocalRepository {
    findOne(id: string): Promise<Job | undefined>
    findAll(): Promise<Job[]>
    deleteAll(): Promise<void>
    storeAll(jobs: Job[]): Promise<void>
    storeUnique(job: Job): Promise<void>
}
