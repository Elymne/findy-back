import RunServer from "./domain/usecases/running/RunServer.usecase";
import ExpressServer from "./infrastructure/express/ExpressServer";

const runServer: RunServer = new RunServer(new ExpressServer());
runServer.perform();
