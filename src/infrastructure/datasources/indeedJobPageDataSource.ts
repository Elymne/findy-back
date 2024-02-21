import axios, { AxiosResponse } from "axios";
import { getRandomUserAgent } from "../../core/config/headersTools";
import { Failure, Result, Success } from "../../core/tools/usecases";

export const IndeedJobsPageDatasource = {
    /**
     * Just get the content of an indeed page research jobs.
     * ! Doesn't works as this website is protected.
     * @param {string} query A simple query string to make a call to https://fr.indeed.com.
     * @link https://fr.indeed.com.
     * @returns {Promise<AxiosResponse>} An Axios response.
     */
    async getIndeedJobsPage(query: string): Promise<AxiosResponse> {
        const baseUrl = "https://fr.indeed.com/";
        const headers = {
            "User-Agent": getRandomUserAgent(),
        };

        const response = await axios.get(`${baseUrl}`, {
            headers,
        });

        return response;
    },
};
