import Job from "../models/Job.model"

export default interface JobRemoteRepository {
    findAll(): Promise<Job[]>
}
