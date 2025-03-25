import { Router } from "express";
import getJobsRoute from "./getJobs.route";

const jobRouter = Router();

jobRouter.use(getJobsRoute);

export default jobRouter;
