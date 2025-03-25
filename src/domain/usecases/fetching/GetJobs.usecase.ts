import { Result, ResultType, UsecaseNoParams } from "@App/core/Usecase";
import Job from "@App/domain/models/Job.model";
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository";

export default class GetJobs extends UsecaseNoParams<Job[]> {
    private jobRepository: JobRemoteRepository;

    constructor(jobRepository: JobRemoteRepository) {
        super();
        this.jobRepository = jobRepository;
    }

    public async perform(): Promise<Result<Job[]>> {
        try {
            const result = await this.jobRepository.findAll();

            if (result.length == 0) {
                return new Result(ResultType.SUCCESS, 204, "[GetJobs] No Jobs found. It may be a problem.", [], null);
            }

            return new Result(ResultType.SUCCESS, 200, "[GetJobs] Jobs found.", result, null);
        } catch (err) {
            return new Result<Job[]>(ResultType.FAILURE, 500, "[GetJobs] An exception has been throw. Check logs.", null, err);
        }
    }
}
