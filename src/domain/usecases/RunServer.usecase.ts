import { UsecaseNoParams, Result, ResultType } from "@App/core/Usecase";
import Server from "../gateways/Server.gateways";

export default class RunServer extends UsecaseNoParams<null> {
    private server: Server;

    public constructor(server: Server) {
        super();
        this.server = server;
    }

    public async perform(): Promise<Result<null>> {
        try {
            this.server.createAndServe();
            return new Result(ResultType.SUCCESS, 0, "[RunServer] Server has started successfully !", null, 1);
        } catch (err) {
            return new Result(ResultType.FAILURE, 1, "[RunServer] An error occured while starting the server !", null, 1);
        }
    }
}
