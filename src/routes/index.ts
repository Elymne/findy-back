import express, { Request, Response } from "express";
import jobsRoutes from "./jobs";

const router = express.Router();

router.use("/jobs", jobsRoutes);
router.use("/", (req: Request, res: Response) => {
  res.send("API in progress.");
});

export default router;
