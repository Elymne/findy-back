import { Failure, Result, Success } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import ScrapSite from "../scrapping/ScrapSite.usecase"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"
import OfferScrap from "@App/domain/models/scrap/Offer.scrap"
import ParseOffersScrap, { OffersScrapResult } from "../parsing/ParseOffersScrap.usecase"
import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"

export default class UpdateOffers extends UsecaseNoParams<void> {
    private scrapSites: ScrapSite[]
    private parseOffersScrap: ParseOffersScrap
    private jobLocalRepository: JobLocalRepository
    private companyLocalRepository: CompanyLocalRepository
    private offerLocalRepository: OfferLocalRepository

    constructor(
        scrapSites: ScrapSite[],
        parseOffersScrap: ParseOffersScrap,
        jobLocalRepository: JobLocalRepository,
        companyLocalRepository: CompanyLocalRepository,
        offerLocalRepository: OfferLocalRepository
    ) {
        super()
        this.scrapSites = scrapSites
        this.parseOffersScrap = parseOffersScrap
        this.jobLocalRepository = jobLocalRepository
        this.companyLocalRepository = companyLocalRepository
        this.offerLocalRepository = offerLocalRepository
    }

    public async perform(): Promise<Result<void>> {
        try {
            // Prepare scrapping.
            const streamedOfferScrapResults: Promise<Result<OfferScrap[]>>[] = []
            const lastUpdateDate = await this.offerLocalRepository.getLastTimeUpdate()
            if (!lastUpdateDate) {
                for (let i = 0; i < this.scrapSites.length; i++) {
                    streamedOfferScrapResults.push(this.scrapSites[i].perform({ pageNumber: 50 }))
                }
            } else {
                for (let i = 0; i < this.scrapSites.length; i++) {
                    //TODO : scrap by newest date.
                    for (let i = 0; i < this.scrapSites.length; i++) {
                        streamedOfferScrapResults.push(this.scrapSites[i].perform({ pageNumber: 50 }))
                    }
                }
            }

            // Run scrappers.
            const rawOffers: OfferScrap[] = []
            const offerResults = await Promise.all(streamedOfferScrapResults)
            for (const r of offerResults) {
                if (r instanceof Success) {
                    rawOffers.push(...r.data)
                }
            }

            // Parse scrappers result.
            const parseResult = await this.parseOffersScrap.perform({ offerScraps: rawOffers, jobs: await this.jobLocalRepository.findAll() })
            if (parseResult instanceof Failure) {
                return parseResult
            }

            // Store news companies and offers.
            const { offers, newCompanies } = (parseResult as Success<OffersScrapResult>).data
            await this.companyLocalRepository.createMany(newCompanies)
            await new Promise((f) => setTimeout(f, 1_000))
            await this.offerLocalRepository.createMany(offers)

            // Return the result top use client.
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
