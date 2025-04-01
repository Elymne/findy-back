import { Failure, Result, Success } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import ScrapSite from "../scrapping/ScrapSite.usecase"
import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import Offer from "@App/domain/models/Offer.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"

export default class UpdateOffers extends UsecaseNoParams<void> {
    private scrapSites: ScrapSite[]

    private companyLocalRepository: CompanyLocalRepository
    private zoneLocalRepository: ZoneLocalRepository
    private jobLocalRepository: JobLocalRepository
    private offerLocalRepository: OfferLocalRepository

    constructor(
        scrapPages: ScrapSite[],
        companyLocalRepository: CompanyLocalRepository,
        zoneLocalRepository: ZoneLocalRepository,
        jobLocalRepository: JobLocalRepository,
        offerLocalRepository: OfferLocalRepository
    ) {
        super()
        this.scrapSites = scrapPages

        this.companyLocalRepository = companyLocalRepository
        this.zoneLocalRepository = zoneLocalRepository
        this.jobLocalRepository = jobLocalRepository
        this.offerLocalRepository = offerLocalRepository
    }

    public async perform(): Promise<Result<void>> {
        try {
            const lastUpdateDate = await this.offerLocalRepository.getLastTimeUpdate()
            const streamedOfferResults: Promise<Result<Offer[]>>[] = []
            if (!lastUpdateDate) {
                for (let i = 0; i < this.scrapSites.length; i++) {
                    streamedOfferResults.push(this.scrapSites[i].perform({ pageNumber: 100 }))
                }
            } else {
                for (let i = 0; i < this.scrapSites.length; i++) {
                    console.log("Wait")
                }
            }

            const rawOffers: Offer[] = []
            const offerResults = await Promise.all(streamedOfferResults)
            for (const r of offerResults) {
                if (r instanceof Success) {
                    rawOffers.push(...r.data)
                }
            }

            // TODO Check de la data (Type job, zone et boite).
            // TODO Si une nouvelle entrée (job ou boite) est trouvé, c'est-à-dire qu'elle n'existe pas dans la base de données, on la rajoute.
            // for (let i = 0; i < result.length; i++) {
            //     let company: Company | undefined
            //     if (!result[i].company.id && result[i].company.name) {
            //         const companies = await this.companyLocalRepository.findByName(result[i].company.name!)
            //         if (companies.length > 0) {
            //             company = companies[0]
            //         }
            //     }
            //     console.log(company)
            // }

            return new Success(204, `[${this.constructor.name}] Trying to make an update of offers : success`, undefined)
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to make an update of offers : An exception has been thrown.`,
                { message: "An internal error occured while making an update of offers" },
                trace
            )
        }
    }
}
