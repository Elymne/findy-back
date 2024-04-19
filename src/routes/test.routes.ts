import express, { Request, Response } from "express"

const testRouter = express.Router().get("/", async (req: Request, res: Response) => {
    res.status(418).send({ message: "GOUGAGAX" })
})

export default testRouter
