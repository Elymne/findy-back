import TextFilter from "@App/domain/entities/textFilter.entity"
import TextFilterModel from "./models/textFilter.model"
import MongodbClient from "@App/core/clients/mongodb.client"

export default interface TextFilterDatasource {
    findAll: () => Promise<TextFilter[]>
    addOne: (value: TextFilterModel) => Promise<void>
    addAll: (values: TextFilterModel[]) => Promise<void>
}

export const TextFilterDatasourceImpl: TextFilterDatasource = {
    findAll: async function (): Promise<TextFilter[]> {
        const collection = MongodbClient.getInstance().getCollection<TextFilterModel>("text_filter")
        return (await collection.find().toArray()) as TextFilter[]
    },

    addOne: async function (value: TextFilterModel): Promise<void> {
        const collection = MongodbClient.getInstance().getCollection<TextFilterModel>("text_filter")
        await collection.insertOne(value)
    },

    addAll: async function (values: TextFilterModel[]): Promise<void> {
        if (values.length <= 0) {
            return
        }

        const collection = MongodbClient.getInstance().getCollection<TextFilterModel>("text_filter")
        await collection.insertMany(values)
    },
}
