import { Result, ResultType, Usecase } from "@App/core/Usecase";
import Job from "@App/domain/models/Job.model";
import JobScrapperRepository from "@App/domain/repositories/JobScrapper.repository";

export default class ScrapOnePage extends Usecase<Job[], ScrapOnePageParams> {
    private jobScrapperRepository: JobScrapperRepository;

    constructor(jobScrapperRepository: JobScrapperRepository) {
        super();
        this.jobScrapperRepository = jobScrapperRepository;
    }

    public async perform(params: ScrapOnePageParams): Promise<Result<Job[]>> {
        try {
            this.jobScrapperRepository.getOnePage(params.pageIndex);
            return new Result(ResultType.SUCCESS, 200, "[ScrapOnePage] The page has been scraped without any problems.", [], null);
        } catch (err) {
            return new Result<Job[]>(ResultType.FAILURE, 500, "[ScrapOnePage] An exception has been throw. Check logs.", null, err);
        }
    }
}

interface ScrapOnePageParams {
    pageIndex: number;
}
