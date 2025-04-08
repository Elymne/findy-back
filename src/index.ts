import "reflect-metadata"
import { container } from "tsyringe"
import runContainer from "@App/infrastructure/di/di"
import RunServer from "@App/domain/usecases/running/RunServer.usecase"

runContainer() // DI Container runner.
container.resolve(RunServer).perform() // Run the server.
