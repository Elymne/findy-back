import MongodbClient from "./core/clients/mongodb.client"
import PupetteerClient from "./core/clients/pupetteer.client"
import MongoDBExceptions from "./core/exceptions/mongodbException"
import logger from "./core/tools/logger"
import app from "./server"

const port = process.env.PORT ?? "3000"
app.listen(port, async () => {
    if (process.env.MONGODB_CONNEC_STRING == null || process.env.MONGODB_NAME == null) {
        logger.error(MongoDBExceptions.envVariableNotDefined)
        throw Error(MongoDBExceptions.envVariableNotDefined)
    }

    Promise.all([
        PupetteerClient.getInstance().init(),
        MongodbClient.getInstance().init({
            connectString: process.env.MONGODB_CONNEC_STRING,
            dbName: process.env.MONGODB_NAME,
        }),
    ])

    logger.info(`Server is running at http://localhost:${port}`)
})
