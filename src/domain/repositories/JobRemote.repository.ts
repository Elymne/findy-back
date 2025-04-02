import Job from "../models/clean/Job.model"

export default interface JobRemoteRepository {
    findAll(): Promise<Job[]>
}
