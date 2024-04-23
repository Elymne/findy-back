import logger from "@App/core/tools/logger"
import { Failure, Result, Success, Usecase } from "../../../core/interfaces/abstract.usecase"
import PageOffersWTTJDatasource, {
    PageOffersWTTJDatasourceImpl,
} from "@App/infrastructure/remote/welcomeToTheJungle/jobOfferWTTJ.datasource"
import JobOffer from "@App/domain/entities/jobOffer.entity"

type GetSampleUsecaseParams = {
    categ: string
}

export default interface GetSampleUsecase extends Usecase<JobOffer[], GetSampleUsecaseParams> {
    pageOffersWTTJDatasource: PageOffersWTTJDatasource
}

export const GetSampleUsecaseImpl: GetSampleUsecase = {
    pageOffersWTTJDatasource: PageOffersWTTJDatasourceImpl,

    perform: async function (params: GetSampleUsecaseParams): Promise<Result<JobOffer[]>> {
        const query = {
            // ? this is Paris coordinates.
            lat: 48.8589,
            lng: 2.347,
            range: 30,
            keyWords: "",
        }
        try {
            switch (params.categ) {
                case "marketing": {
                    query.keyWords = "marketing"
                    break
                }
                case "communication": {
                    query.keyWords = "communication"
                    break
                }
                case "comptability": {
                    query.keyWords = "comptabilité"
                    break
                }
                case "webdev": {
                    query.keyWords = "dévelopement web"
                    break
                }
                case "rh": {
                    query.keyWords = "rh"
                    break
                }
                case "commercial": {
                    query.keyWords = "commercial"
                    break
                }
                default:
                    query.keyWords = "marketing"
            }

            const result = await this.pageOffersWTTJDatasource.findAllByQuery(query)

            return new Success({
                message: "The sample of job offers has been fetched successfully",
                data: result.jobOffers,
            })
        } catch (error) {
            logger.error("[GetSampleUsecase]", error)
            return new Failure({
                message: "An internal error occur",
                errorCode: 500,
            })
        }
    },
}
