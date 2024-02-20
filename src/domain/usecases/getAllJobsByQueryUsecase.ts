import { JobRepository } from "../../infrastructure/repositories/jobRepositoryImpl";
import { Job } from "../entities/job";
import { Result, Success, Failure } from "../../core/usecases";

export const GetAllJobsFromQuery = {
  async perform(params: string): Promise<Result<Job[]>> {
    try {
      const result: Job[] = await JobRepository.getJobsFromQuery(params);
      return new Success(result);
    } catch (error) {
      console.log(error);
      return new Failure("Something went wrong");
    }
  },
};
