import RunServer from "./domain/usecases/running/RunServer.usecase"
import KyselyDatabase from "./infrastructure/datasources/kysely/db/KyselyDatabase"
import ExpressServer from "./infrastructure/express/ExpressServer"

const runServer: RunServer = new RunServer(new ExpressServer(), KyselyDatabase.get)
runServer.perform()
