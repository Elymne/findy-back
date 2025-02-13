import { Router } from "express";
import getJobsRouter from "./GetJobs.route";

const jobRouter = Router();
jobRouter.use(getJobsRouter);
export default jobRouter;
