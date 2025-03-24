import { Result, ResultType, Usecase } from "@App/core/Usecase";
import Offer from "@App/domain/models/Offer.model";
import JobScrapperRepository from "@App/domain/repositories/JobScrapper.repository";

export default class ScrapOnePage extends Usecase<Offer[], ScrapOnePageParams> {
    private jobScrapperRepository: JobScrapperRepository;

    constructor(jobScrapperRepository: JobScrapperRepository) {
        super();
        this.jobScrapperRepository = jobScrapperRepository;
    }

    public async perform(params: ScrapOnePageParams): Promise<Result<Offer[]>> {
        try {
            const result = await this.jobScrapperRepository.getOnePage(params.pageIndex);

            if (result.length == 0) {
                return new Result(ResultType.SUCCESS, 204, "[ScrapOnePage] No Offers scrapped. You should check web site HTML that you are scraping, changes may have been done.", [], null);
            }

            return new Result(ResultType.SUCCESS, 200, "[ScrapOnePage] The page has been scraped without any problems.", result, null);
        } catch (err) {
            return new Result<Offer[]>(ResultType.FAILURE, 500, "[ScrapOnePage] An exception has been throw. Check logs.", null, err);
        }
    }
}

interface ScrapOnePageParams {
    pageIndex: number;
}
