import RunServer from "./domain/usecases/running/RunServer.usecase"
import { MysqlDatabase } from "./infrastructure/datasources/mysql/db/MysqlDatabase"
import ExpressServer from "./infrastructure/express/ExpressServer"

const runServer: RunServer = new RunServer(new ExpressServer(), MysqlDatabase.getInstance())
runServer.perform()
