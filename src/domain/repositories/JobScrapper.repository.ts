import Job from "../models/Job.model";

export default interface JobScrapperRepository {
    getOnePage(pageIndex: number): Promise<Job[]>;
}
