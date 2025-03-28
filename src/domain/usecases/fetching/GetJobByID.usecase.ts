import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Job from "@App/domain/models/Job.model"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"

export interface GetJobByIDParams {
    id: string
}

export default class GetJobByID extends Usecase<Job[], GetJobByIDParams> {
    private jobLocalRepository: JobLocalRepository

    constructor(jobLocalRepository: JobLocalRepository) {
        super()
        this.jobLocalRepository = jobLocalRepository
    }

    public async perform(params: GetJobByIDParams): Promise<Result<Job[]>> {
        try {
            const result = await this.jobLocalRepository.findOne(params.id)
            if (!result) {
                return new Failure(404, `[${this.constructor.name}] Trying to fetch the job ${params.id} : it does not exists.`, {
                    message: `The code ${params.id} does not correspond to any jobs`,
                })
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch jobs : success.`, result)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] Trying to fetch jobs : An exception has been thrown.`, { message: "An internal error occured while fetching jobs data." }, trace)
        }
    }
}
