import { Failure, Result, Success } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository"

export default class UpdateJobs extends UsecaseNoParams<void> {
    private jobLocalRepository: JobLocalRepository
    private jobRemoteRepository: JobRemoteRepository

    constructor(jobLocalDatasource: JobLocalRepository, jobRemoteDatasource: JobRemoteRepository) {
        super()
        this.jobLocalRepository = jobLocalDatasource
        this.jobRemoteRepository = jobRemoteDatasource
    }

    public async perform(): Promise<Result<void>> {
        try {
            const newJobs = await this.jobRemoteRepository.findAll()
            if (newJobs.length == 0) {
                return new Failure(500, `[${this.constructor.name}] Trying to make an update of jobs : No jobs found from remote datasource (odd behavior). Jobs from local datasource rest intact.`, {
                    message: "An error occured while making the update of jobs because data were not found on remote datasource. Old jobs stay instact.",
                })
            }

            // await this.jobLocalDatasource.deleteAll()
            await this.jobLocalRepository.storeAll(newJobs)

            return new Success(204, `[${this.constructor.name}] Trying to make an update of jobs : success`, undefined)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to make an update of jobs : An exception has been thrown.`,
                { message: "An internal error occured while making an update of jobs" },
                trace
            )
        }
    }
}
