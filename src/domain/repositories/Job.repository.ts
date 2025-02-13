import Job from "../models/Job.model";

export default interface JobCodeRepository {
    findAll(): Promise<Job[]>;
    findOne(code: string): Promise<Job>;
}
