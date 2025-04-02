import Company from "../models/clean/Company.model"

export default interface CompanyLocalRepository {
    findOne(id: string): Promise<Company | undefined>
    findAll(): Promise<Company[]>
    findByName(name: string): Promise<Company[]>
    deleteOne(id: string): Promise<void>
    createMany(jobs: Company[]): Promise<void>
    createOne(job: Company): Promise<void>
}
