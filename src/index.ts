import { PgClient } from "./core/clients/pg.client"
import { PupetteerClient } from "./core/clients/pupetteer.client"
import app from "./server"

const port = process.env.PORT ?? "3000"
app.listen(port, async () => {
    Promise.all([
        PupetteerClient.getInstance().initBrowser(),
        PgClient.getInstance().initClient({
            host: process.env.PG_HOST,
            port: Number.parseInt(process.env.PG_PORT ?? ""),
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
        }),
    ])

    console.log(`Server is running at http://localhost:${port}`)
})
