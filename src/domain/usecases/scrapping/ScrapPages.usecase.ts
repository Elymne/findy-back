import { Result, ResultType, Usecase } from "@App/core/Usecase";
import Offer from "@App/domain/models/Offer.model";
import ScrapOnePage from "./ScrapOnePage.usecase";

/**
 * Scrap a precise number of pages from any web site given the repository implementation of {ScrapOnePage} usecase used here..
 * @prop {ScrapOnePage} ScrapOnePage
 * @extends {Usecase}
 */
export default class ScrapPages extends Usecase<Offer[], ScrapPagesParams> {
    private scrapOnePage: ScrapOnePage;

    constructor(scrapOnePage: ScrapOnePage) {
        super();
        this.scrapOnePage = scrapOnePage;
    }

    public async perform(params: ScrapPagesParams): Promise<Result<Offer[]>> {
        try {
            const result: Offer[] = [];
            const streamedPageScrapping: Promise<Result<Offer[]>>[] = [];

            // When params.pageNumber is define.
            if (params.pageNumber) {
                for (let i = 1; i <= params.pageNumber; i++) {
                    streamedPageScrapping.push(this.scrapOnePage.perform({ pageIndex: i }));
                }

                const results = await Promise.all(streamedPageScrapping);

                for (const r of results) {
                    if (r.type == ResultType.SUCCESS) {
                        result.push(...(r.data ?? []));
                    }
                }

                if (results.length == 0) {
                    return new Result(ResultType.SUCCESS, 204, "[ScrapPages] No offers have been found. Check the website or the scrapper as it's not normal.", [], null);
                }

                return new Result(ResultType.SUCCESS, 400, "[ScrapPages] The pages have been scraped without any problems.", result, null);
            }

            // When params.maxDay is define.
            if (params.maxDay) {
                throw "Not implemented yet.";
            }

            return new Result<Offer[]>(ResultType.FAILURE, 400, "[ScrapPages] Params should have at least one value defined.", null, params);
        } catch (err) {
            return new Result<Offer[]>(ResultType.FAILURE, 500, "[ScrapPages] An exception has been throw. Check logs.", null, err);
        }
    }
}

/**
 * Only one of the two properties should be defined. In case two are defined, the pageNumber will be the first priority.
 * @prop {number | undefined} pageNumber - The maximum page you want to scrap from 1 to the number you want.
 * @prop {number | undefined} maxDay - The value of maximum oldest date of offers you want to scrap.
 */
export interface ScrapPagesParams {
    pageNumber: number | undefined;
    maxDay: number | undefined;
}
