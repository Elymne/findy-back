import Company from "../models/clean/Company.model"

export default interface CompanyLocalRepository {
    findOne(id: string): Promise<Company | undefined>
    findAll(): Promise<Company[]>
    findByName(name: string): Promise<Company | undefined>

    createMany(companies: Company[]): Promise<void>
    createOne(companies: Company): Promise<void>

    update(companies: Company[]): Promise<void>

    deleteOne(id: string): Promise<void>
}
