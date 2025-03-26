import { NextFunction, Request, Response } from "express"

// todo faire un  truc propre wallah j'ai juré.
export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const reject = () => {
        res.setHeader("www-authenticate", "Basic")
        res.sendStatus(401)
    }

    const authorization = req.headers.authorization
    if (authorization == null) {
        return reject()
    }

    const [username, password] = Buffer.from(authorization.replace("Basic ", ""), "base64").toString().split(":")

    if (!(username === "findyalternance" && password === "tamaman")) {
        return reject()
    }

    next()
}
