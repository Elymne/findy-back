import Offer from "@App/domain/models/Offer.model"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"
import { OfferModel } from "./tables/Offer.table"

/**
 * Currently using Databse with kysely tools to connect top mysql database.
 */
export default class OfferDatasource implements OfferLocalRepository {
    /**
     * Simply fetch one offer from database.
     * @param {string} id
     * @returns {Offer | undefined}
     */
    async findOne(id: string): Promise<Offer | undefined> {
        throw new Error("Method not implemented.")
    }

    /**
     * Get a large sample of offer dependending of params given.
     * @param params Go check the interface implemeneded here.
     * @return {Offer[]} List of offer given the params.
     */
    async findMany(params: { keyWords?: string; codezone?: string; codejob?: string; distance?: number; range: string }): Promise<Offer[]> {
        throw new Error("Method not implemented.")
    }

    /**
     * Store as many offer scraped that I can to database.
     * Will update last_time_update table to to teh current date. This is very important because I need to know which data need to be updated.
     * @param {Offer[]} offer
     */
    saveMany(offer: Offer[]): Promise<void> {
        console.log(offer)
        throw new Error("Method not implemented.")
    }

    /**
     * this should be used to delete oldest values in database. This will be a usecase job.
     * @param {string[]} ids
     */
    deleteAll(ids: string[]): Promise<number> {
        throw new Error("Method not implemented.")
    }

    /**
     * Allow us to know last time data where updated. Very important for our saving scraping usecases.
     * @return {number | undefined}
     */
    async getLastTimeUpdate(): Promise<number | undefined> {
        throw new Error("Method not implemented.")
    }

    /**
     *
     * @param timestamp
     */
    updateLastTimeUpdate(timestamp: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
}

function parseOfferModel(offerModel: OfferModel): Offer {
    return {
        id: offerModel?.id,
        title: offerModel?.title,
        company: offerModel?.company,
        companyLogoUrl: offerModel?.companyLogoUrl,
        zone: offerModel?.codezone,
        imgUrl: offerModel?.imgUrl,
        jobTitle: offerModel?.codejob,
        tags: offerModel?.tags.values,
        origin: offerModel?.origin,
        createdAt: offerModel?.createdAt,
        updateAt: offerModel?.updateAt,
    } as Offer
}
