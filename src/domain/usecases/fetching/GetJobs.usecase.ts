import { failed, Result, succeed, SuccessType } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Job from "@App/domain/models/Job.model"
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository"

export default class GetJobs extends UsecaseNoParams<Job[]> {
    private jobRepository: JobRemoteRepository

    constructor(jobRepository: JobRemoteRepository) {
        super()
        this.jobRepository = jobRepository
    }

    public async perform(): Promise<Result<Job[]>> {
        try {
            const result = await this.jobRepository.findAll()
            if (result.length == 0) {
                return succeed(204, `[${this.constructor.name}] Trying to fetch jobs : none found (odd behavior).`, result, SuccessType.WARNING)
            }
            return succeed(200, `[${this.constructor.name}] Trying to fetch jobs : success.`, result)
        } catch (trace) {
            return failed(500, `[${this.constructor.name}] Trying to fetch jobs : An exception has been thrown.`, { message: "An internal error occured while fetching jobs data." }, trace)
        }
    }
}
