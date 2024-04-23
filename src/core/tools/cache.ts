import { Request, Response } from "express"
import apicache from "apicache"

const cache = apicache.middleware

/**
 * For daily job query.
 */
export const cache24hours = cache("24 hours", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206
})

/**
 * For sample usage.
 */
export const cacheWeek = cache("7 days", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206
})

/**
 * For cities fetching but useless now because we don't use this anymore.
 */
export const cache5Mins = cache("5 minutes", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206
})
