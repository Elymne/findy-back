import express, { Request, Response, NextFunction } from "express";
import { Success } from "../core/usecases";
import { GetAllJobsFromQuery } from "~/domain/usecases/getAllJobsByQueryUsecase";

const router = express.Router();

/**
 * Get list of Jobs from our scrapping work.
 */
router.get("/", async (req: Request, res: Response) => {
  const result = await GetAllJobsFromQuery.perform("Dev");

  if (result instanceof Success) {
    res.status(200).send(result);
    return;
  }

  res.status(404).send(result);
});

export default router;
