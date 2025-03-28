import Company from "../models/Company.model"

export default interface CompanyLocalRepository {
    findOne(id: string): Promise<Company | undefined>
    findAll(): Promise<Company[]>
    findByName(name: string): Promise<Company[]>
    deleteAll(): Promise<void>
    storeAll(jobs: Company[]): Promise<void>
    storeUnique(job: Company): Promise<void>
}
