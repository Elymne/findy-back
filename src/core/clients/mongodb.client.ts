import { Collection, Db, MongoClient } from "mongodb"
import MongoDBExceptions from "../errors/mongodbErrors"
import logger from "../tools/logger"

export default class MongodbClient {
    private static instance: MongodbClient
    private client: MongoClient
    private db: Db

    private constructor() {}

    public static getInstance(): MongodbClient {
        if (!MongodbClient.instance) {
            MongodbClient.instance = new MongodbClient()
        }
        return MongodbClient.instance
    }

    async init(options: MongodbClientOption): Promise<void> {
        this.client = new MongoClient(options.connectString)
        await this.client.connect()
        this.db = this.client.db(options.dbName)
    }

    getCollection<T extends Document>(name: string): Collection<T> {
        if (this.client == null || this.db == null) {
            logger.error(MongoDBExceptions.notInit)
            throw Error(MongoDBExceptions.notInit)
        }
        return this.db.collection<T>(name)
    }
}

type MongodbClientOption = {
    connectString: string
    dbName: string
}
