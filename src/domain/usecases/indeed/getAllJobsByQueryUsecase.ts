import { Job } from "../../entities/job";
import { Result, Success, Failure } from "../../../core/tools/usecases";
import { JobScrapper } from "../../../infrastructure/scrappers/jobScrapper";
import { IndeedJobsPageDatasource } from "../../../infrastructure/datasources/indeedJobPageDataSource";

/**
 *
 */
export const GetAllJobsFromQuery = {
    async perform(query: string): Promise<Result<Job[]>> {
        try {
            const response = await IndeedJobsPageDatasource.getIndeedJobsPage(query);

            const jobs: Job[] = await JobScrapper.getJobsFromHtml(response.data);

            return new Success(jobs);
        } catch (error) {
            console.log(error);
            return new Failure({
                timestamp: Date.now(),
                status: 500,
                error: "Error while fetching indeeds data",
                message: error,
            });
        }
    },
};
