import axios, { AxiosResponse } from "axios";
import { Failure, Result, Success } from "../../core/tools/usecases";
import { ApiGouvConfig } from "../../core/config/apigouvConfig";

/**
 * A simple datasource that use api.gouv to fetch intership job offer data.
 * @link https://api.gouv.fr/les-api/api-la-bonne-alternance
 */
export const InternshipOfferDatasource = {
    /**
     * Simply call the API to get the list of all profession.
     * We may use this for filtering purpose in front-end.
     * @returns {Promise<Result<AxiosResponse>>} A promise with a result (failure or success) that will be managed in a specific usecase.
     */
    async getProfessionList(): Promise<Result<AxiosResponse>> {
        const url = `${ApiGouvConfig.labonnealternanceBaseUrl}/${ApiGouvConfig.labonnealternanceBaseVersion}/metiers/all`;

        try {
            const response = await axios.get(`${url}`, {});
            return new Success(response);
        } catch (error) {
            return new Failure({
                timestamp: Date.now(),
                status: 500,
                error: "Error while accessing to Gouv API",
                message: error,
            });
        }
    },

    /**
     *
     */
};
