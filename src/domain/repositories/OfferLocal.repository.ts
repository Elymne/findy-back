import Offer from "../models/Offer.model"

export default interface OfferLocalRepository {
    findOne(id: string): Promise<Offer | undefined>
    findMany(params: FindManyParams): Promise<Offer[]>

    saveMany(offer: Offer[]): Promise<void>
    deleteAll(ids: string[]): Promise<number>

    getLastTimeUpdate(): Promise<number | undefined>
}

/**
 * @prop {string} keyWords Just check the title.
 * @prop {string} codeZone This information is simple to get, again, a work for scraper usecase.
 * @prop {string} codeJob This information may be a bit hard to determine. Should be a works to do for scrapers usecase.
 * @prop {string} distance This information may not be available for scrapped data.
 * @prop {string} range Example : 10-40 to get 30 offers. It shoulf works like a pager.
 */
type FindManyParams = {
    keyWords?: string
    codezone?: string
    codejob?: string
    distance?: number
    range: string
}
