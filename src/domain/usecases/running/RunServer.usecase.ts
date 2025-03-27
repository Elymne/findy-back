import { Failure, Result, Success } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import IDatabase from "@App/domain/gateways/IDatabase.gateways"
import IServer from "@App/domain/gateways/IServer.gateways"
import dotenv from "dotenv"

/**
 * This usecase shoudl be used to start the server.
 * How does my server start running :
 *  - Starting the connection to the local database used by my server (Can be any type of database depending of the implementation of IDatabase).
 *  - Then starting the Node server (Can be anything depending of the implementation of IServer)
 */
export default class RunServer extends UsecaseNoParams<void> {
    private server: IServer
    private database: IDatabase

    public constructor(server: IServer, database: IDatabase) {
        super()
        this.server = server
        this.database = database
    }

    public async perform(): Promise<Result> {
        try {
            dotenv.config()
            await this.database.startConnec()
            await this.server.createAndServe()
            return new Success(0, `[${this.constructor.name}] Running server : success`, undefined)
        } catch (trace) {
            return new Failure(1, `[${this.constructor.name}] Running server : An exception has been thrown.`, undefined, trace)
        }
    }
}
