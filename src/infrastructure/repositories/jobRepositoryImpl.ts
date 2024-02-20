import { Job } from "../../domain/entities/job";
import { IndeedJobsPageDatasource } from "../datasources/remote/indeedJobPageDataSource";

export const JobRepository = {
  /**
   * Scrapinf data from the html data given by getIndeedJobsPage function from IndeedJobsPageDatasource.
   * @param {string} query
   * @returns {Promise<Job[]>} Get the list of all jobs parsed from the Indeed page. We do not catch error here, usecase will do for us.
   */
  async getJobsFromQuery(query: string): Promise<Job[]> {
    const response = await IndeedJobsPageDatasource.getIndeedJobsPage(query);
    console.log(response);
    return [];
  },
};
