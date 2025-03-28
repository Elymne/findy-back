import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Job from "@App/domain/models/Job.model"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"

export default class GetJobs extends UsecaseNoParams<Job[]> {
    private jobLocalRepository: JobLocalRepository

    constructor(jobLocalRepository: JobLocalRepository) {
        super()
        this.jobLocalRepository = jobLocalRepository
    }

    public async perform(): Promise<Result<Job[]>> {
        try {
            const result = await this.jobLocalRepository.findAll()
            if (result.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to fetch jobs : none found (odd behavior).`, result, SuccessType.WARNING)
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch jobs : success.`, result)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] Trying to fetch jobs : An exception has been thrown.`, { message: "An internal error occured while fetching jobs data." }, trace)
        }
    }
}
