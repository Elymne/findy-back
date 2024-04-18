import { Collection } from "mongodb"
import JobOfferHistoryModel from "./models/JobOfferHistory.model"
import MongodbClient from "@App/core/clients/mongodb.client"
import JobOfferHistory from "@App/domain/entities/jobOfferHistory"

export default interface JobOfferHistoryDatasource {
    collection: Collection<JobOfferHistoryModel>
    findOne: (id: string) => Promise<JobOfferHistory | null>
    findManyBySourceType: (sourceType: string) => Promise<JobOfferHistory[]>
    addMany: (values: JobOfferHistoryModel[]) => Promise<void>
}

export const JobOfferHistoryDatasourceImpl: JobOfferHistoryDatasource = {
    collection: MongodbClient.getInstance().getCollection<JobOfferHistoryModel>("job_offer_history"),

    findOne: async function (id: string): Promise<JobOfferHistory | null> {
        const query = { id: id }
        return (await this.collection.findOne(query)) as JobOfferHistory
    },

    findManyBySourceType: async function (sourceType: string): Promise<JobOfferHistory[]> {
        const query = { sourceType: new String(sourceType) }
        return await this.collection.find(query).toArray()
    },

    addMany: async function (values: JobOfferHistoryModel[]): Promise<void> {
        this.collection.insertMany(values)
    },
}
