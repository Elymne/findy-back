import { Request, Response } from "express"
import apicache from "apicache"

const cache = apicache.middleware

export const cache24Successes = cache("24 hours", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206
})
