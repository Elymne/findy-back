import { Collection, ObjectId } from "mongodb"
import JobOfferHistoryModel from "./models/JobOfferHistory.model"
import MongodbClient from "@App/core/clients/mongodb.client"

export default interface JobOfferHistoryDatasource {
    collection: Collection<JobOfferHistoryModel>
    findOne: (id: string) => Promise<JobOfferHistoryModel | null>
    findAllBySourceType: (sourceType: string) => Promise<JobOfferHistoryModel[]>
}

export const JobOfferHistoryDatasourceImpl: JobOfferHistoryDatasource = {
    collection: MongodbClient.getInstance().getCollection<JobOfferHistoryModel>("job_offer_history"),

    findOne: async function (id: string): Promise<JobOfferHistoryModel | null> {
        const query = { id: id }
        return (await this.collection.findOne(query)) as JobOfferHistoryModel
    },

    findAllBySourceType: async function (sourceType: string): Promise<JobOfferHistoryModel[]> {
        const query = { sourceType: sourceType }
        return await this.collection.find(query).toArray()
    },
}
