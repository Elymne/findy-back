import RunServer from "@App/domain/usecases/running/RunServer.usecase"
import KyselyDatabase from "@App/infrastructure/datasources/kysely/db/KyselyDatabase"
import ExpressServer from "@App/infrastructure/express/ExpressServer"
import "reflect-metadata"
import "@App/infrastructure/di/di"

const runServer: RunServer = new RunServer(new ExpressServer(), KyselyDatabase.get)
runServer.perform()
