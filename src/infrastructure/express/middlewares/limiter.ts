import { rateLimit } from "express-rate-limit"

const defaultLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: "Nope",
    standardHeaders: "draft-7",
    legacyHeaders: false,
})

export default defaultLimiter
