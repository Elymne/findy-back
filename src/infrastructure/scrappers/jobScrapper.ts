import { Job } from "../../domain/entities/job";

export const JobScrapper = {
  /**
   * Scrapinf data from the html data given by getIndeedJobsPage function from IndeedJobsPageDatasource.
   * @param {string} query
   * @returns {Promise<Job[]>} Get the list of all jobs parsed from the Indeed page. We do not catch error here, usecase will do for us.
   */
  async getJobsFromHtml(html: string): Promise<Job[]> {
    console.log(html);
    return [];
  },
};
