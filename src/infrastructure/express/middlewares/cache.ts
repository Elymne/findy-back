import { Request, Response } from "express";
import apicache from "apicache";

const cache = apicache.middleware;

export const cache10mins = cache("10 minutes", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206;
});

export const cache24hours = cache("24 hours", (req: Request, res: Response) => {
    return res.statusCode === 200 || res.statusCode === 206;
});
