import { Failure, Result, Success } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Company from "@App/domain/models/clean/Company.model"
import Job from "@App/domain/models/clean/Job.model"
import Offer from "@App/domain/models/clean/Offer.model"
import Zone from "@App/domain/models/clean/Zone.model"
import OfferScrap from "@App/domain/models/scrap/Offer.scrap"
import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import { injectable } from "tsyringe"
import { v4 as uuid } from "uuid"

@injectable()
export default class ParseOffersScrap extends Usecase<OffersScrapResult, ParseScrapOffersParams> {
    private companyLocalRepository: CompanyLocalRepository
    private zoneLocalRepository: ZoneLocalRepository

    constructor(companyLocalRepository: CompanyLocalRepository, zoneLocalRepository: ZoneLocalRepository) {
        super()
        this.companyLocalRepository = companyLocalRepository
        this.zoneLocalRepository = zoneLocalRepository
    }

    public async perform(params: ParseScrapOffersParams): Promise<Result<OffersScrapResult>> {
        try {
            const offers: Offer[] = []
            const companies: Company[] = []

            const lenght = params.offerScraps.length
            for (let i = 0; i < lenght; i++) {
                const offerScrap: OfferScrap = params.offerScraps[i]

                // ! [TESTING] : check job type from DB.
                // TODO : Job Type may be useless. Have to check if job raw type fetched exists in db.
                const job: Job = {
                    id: "00",
                    title: "Unknown",
                }

                // ! [TESTING] : Get the zone from DB.
                let zone: Zone | null = null

                const zones = await this.zoneLocalRepository.findMany({ name: offerScrap.zone?.name })
                if (zones.length == 0) {
                    // The zone doesn't exists on our database, we skip it.
                    continue
                }
                zone = zones[0]

                // ! [TESTING] : Check company.
                let company: Company | null = null
                const companyFetched = await this.companyLocalRepository.findByName(offerScrap.company.name)
                if (!companyFetched) {
                    // When the company is not found, it mean we didn't register it to our database, so we're gonna store it.
                    company = {
                        id: uuid(),
                        name: offerScrap.company.name,
                        description: offerScrap.company.description,
                        url: offerScrap.company.url,
                        logoUrl: offerScrap.company.logoUrl,
                    }
                    companies.push(company)
                } else {
                    // Company exists in database, let's take it.
                    company = companyFetched
                }

                offers.push({
                    id: uuid(),
                    title: offerScrap.title,
                    imgUrl: offerScrap.imgUrl,

                    tags: offerScrap.tags,

                    zone: zone,
                    job: job,
                    company: company,

                    createdAt: offerScrap.createdAt,
                    updatedAt: offerScrap.updatedAt,
                    origin: offerScrap.origin,
                    originUrl: offerScrap.originUrl,
                })
            }

            const uniqueCompanies = companies.filter((company, index, companies) => {
                return index === companies.findIndex((c) => c.name === company.name)
            })

            return new Success(204, `[${this.constructor.name}] Trying to parse offers and get companies : success.`, {
                offers: offers,
                newCompanies: uniqueCompanies,
            })
        } catch (trace) {
            return new Failure(
                500,
                `[${this.constructor.name}] Trying to parse offers and get companies : An exception has been thrown.`,
                { message: "An internal error occured while parsing offers." },
                trace
            )
        }
    }
}

export type ParseScrapOffersParams = {
    offerScraps: OfferScrap[]
    jobs: Job[]
}

export type OffersScrapResult = {
    offers: Offer[]
    newCompanies: Company[]
}
