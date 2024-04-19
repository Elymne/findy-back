import { Client, Configuration } from "ts-postgres"

export default class PgClient {
    private static instance: PgClient
    private pgClient: Client

    private constructor() {}

    public static getInstance(): PgClient {
        if (!PgClient.instance) PgClient.instance = new PgClient()
        return PgClient.instance
    }

    public async initClient(config: Configuration) {
        this.pgClient = new Client(config)
        await this.pgClient.connect()
    }

    public getClient(): Client {
        if (!this.pgClient) {
            throw new Error("Postgres client hasn't been set")
        }
        return this.pgClient
    }
}
