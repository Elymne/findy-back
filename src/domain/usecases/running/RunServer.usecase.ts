import { failed, Result, succeed } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Server from "@App/domain/gateways/Server.gateways"

export default class RunServer extends UsecaseNoParams<void> {
    private server: Server

    public constructor(server: Server) {
        super()
        this.server = server
    }

    public async perform(): Promise<Result> {
        try {
            this.server.createAndServe()
            return succeed(0, `[${this.constructor.name}] Running server : success`, undefined)
        } catch (trace) {
            return failed(1, `[${this.constructor.name}] Running server : An exception has been thrown.`, undefined, trace)
        }
    }
}
