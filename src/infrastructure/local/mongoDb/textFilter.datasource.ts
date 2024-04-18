import textFilterModel from "./models/textFilter.model"
import MongodbClient from "@App/core/clients/mongodb.client"

export default interface TextFilterDatasource {
    findAll: () => Promise<textFilterModel[]>
    addOne: (value: textFilterModel) => Promise<void>
    addAll: (values: textFilterModel[]) => Promise<void>
}

export const TextFilterDatasourceImpl: TextFilterDatasource = {
    findAll: async function (): Promise<textFilterModel[]> {
        const collection = MongodbClient.getInstance().getCollection<textFilterModel>("text_filter")
        return await collection.find().toArray()
    },

    addOne: async function (value: textFilterModel): Promise<void> {
        const collection = MongodbClient.getInstance().getCollection<textFilterModel>("text_filter")
        await collection.insertOne(value)
    },

    addAll: async function (values: textFilterModel[]): Promise<void> {
        if (values.length <= 0) {
            return
        }

        const collection = MongodbClient.getInstance().getCollection<textFilterModel>("text_filter")
        await collection.insertMany(values)
    },
}
