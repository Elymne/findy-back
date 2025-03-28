import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Company from "@App/domain/models/Company.model"
import Offer from "@App/domain/models/Offer.model"
import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import OfferScrapperRepository from "@App/domain/repositories/OfferScrapper.repository"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"

export default class ScrapOnePage extends Usecase<Offer[], ScrapOnePageParams> {
    private offerScrapperRepository: OfferScrapperRepository
    private jobLocalRepository: JobLocalRepository
    private zoneLocalRepository: ZoneLocalRepository
    private companyLocalRepository: CompanyLocalRepository

    constructor(offerScrapperRepository: OfferScrapperRepository, jobLocalRepository: JobLocalRepository, zoneLocalRepository: ZoneLocalRepository, companyLocalRepository: CompanyLocalRepository) {
        super()
        this.offerScrapperRepository = offerScrapperRepository
        this.jobLocalRepository = jobLocalRepository
        this.zoneLocalRepository = zoneLocalRepository
        this.companyLocalRepository = companyLocalRepository
    }

    public async perform(params: ScrapOnePageParams): Promise<Result<Offer[]>> {
        try {
            const result = await this.offerScrapperRepository.getOnePage(params.pageIndex)
            if (result.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to scrap offers from webpage : none found (odd behavior).`, result, SuccessType.WARNING)
            }

            // TODO Check de la data (Type job, zone et boite).
            // TODO Si une nouvelle entrée (job ou boite) est trouvé, c'est-à-dire qu'elle n'existe pas dans la base de données, on la rajoute.
            for (let i = 0; i < result.length; i++) {
                let company: Company | undefined
                if (!result[i].company.id && result[i].company.name) {
                    const companies = await this.companyLocalRepository.findByName(result[i].company.name!)
                    if (companies.length > 0) {
                        company = companies[0]
                    }
                }
                console.log(company)
            }

            return new Success(200, `[${this.constructor.name}] Trying to scrap offers from webpage : success`, result)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to scrap offers from webpage : An exception has been thrown.`,
                { message: "An internal error occured while scrapping offers" },
                trace
            )
        }
    }
}

interface ScrapOnePageParams {
    pageIndex: number
}
