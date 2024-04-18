import MongodbClient from "@App/core/clients/mongodb.client"
import JobOfferHistoryModel from "./models/JobOfferHistory.model"
import JobOfferHistory from "@App/domain/entities/jobOfferHistory"

export default interface JobOfferHistoryDatasource {
    findOne: (id: string) => Promise<JobOfferHistory | null>
    findManyBySourceType: (sourceType: string) => Promise<JobOfferHistory[]>
    addMany: (values: JobOfferHistoryModel[]) => Promise<void>
}

export const JobOfferHistoryDatasourceImpl: JobOfferHistoryDatasource = {
    findOne: async function (id: string): Promise<JobOfferHistory | null> {
        const collection = MongodbClient.getInstance().getCollection<JobOfferHistoryModel>("job_offer_history")
        return (await collection.findOne({ id: id })) as JobOfferHistory
    },

    findManyBySourceType: async function (sourceType: string): Promise<JobOfferHistory[]> {
        const collection = MongodbClient.getInstance().getCollection<JobOfferHistoryModel>("job_offer_history")
        return await collection.find({ sourceType: new String(sourceType) }).toArray()
    },

    addMany: async function (values: JobOfferHistoryModel[]): Promise<void> {
        if (values.length <= 0) {
            return
        }

        const collection = MongodbClient.getInstance().getCollection<JobOfferHistoryModel>("job_offer_history")
        collection.insertMany(values)
    },
}
