import express, { Application } from "express"
import helmet from "helmet"
import dotenv from "dotenv"
import apiRoute from "./routes"
import cors from "cors"

dotenv.config()

const app: Application = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        optionsSuccessStatus: 200,
    })
)

app.use(apiRoute)
app.use("/static", express.static("public"))
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ status: "API is running on /api !" })
})

export default app
