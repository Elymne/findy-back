import { Collection } from "mongodb"
import textFilterModel from "./models/textFilter.model"
import MongodbClient from "@App/core/clients/mongodb.client"

export default interface TextFilterDatasource {
    collection: Collection<textFilterModel>
    findAll: () => Promise<textFilterModel[]>
    addOne: (value: textFilterModel) => Promise<void>
    addAll: (values: textFilterModel[]) => Promise<void>
}

export const TextFilterDatasourceImpl: TextFilterDatasource = {
    collection: MongodbClient.getInstance().getCollection<textFilterModel>("text_filter"),

    findAll: async function (): Promise<textFilterModel[]> {
        return await this.collection.find().toArray()
    },

    addOne: async function (value: textFilterModel): Promise<void> {
        await this.collection.insertOne(value)
    },

    addAll: async function (values: textFilterModel[]): Promise<void> {
        await this.collection.insertMany(values)
    },
}
