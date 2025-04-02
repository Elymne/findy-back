import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import { CompanyCreate } from "./tables/company_table"
import Company from "@App/domain/models/clean/Company.model"
import KyselyDatabase from "./db/KyselyDatabase"

export default class CompanyLocalDatasource implements CompanyLocalRepository {
    async findOne(id: string): Promise<Company | undefined> {
        const result = await KyselyDatabase.get.connec.selectFrom("company").selectAll().where("id", "=", id).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            name: result.name,
            description: result.description,
            logoUrl: result.logo_url,
            url: result.url,
        }
    }

    async findAll(): Promise<Company[]> {
        const results = await KyselyDatabase.get.connec.selectFrom("company").selectAll().execute()
        return results.map((result) => {
            return {
                id: result.id,
                name: result.name,
                description: result.description,
                logoUrl: result.logo_url,
                url: result.url,
            }
        })
    }

    async findByName(name: string): Promise<Company[]> {
        const results = await KyselyDatabase.get.connec.selectFrom("company").selectAll().where("name", "=", name).execute()
        return results.map((result) => {
            return {
                id: result.id,
                name: result.name,
                description: result.description,
                logoUrl: result.logo_url,
                url: result.url,
            }
        })
    }

    async deleteOne(id: string): Promise<void> {
        await KyselyDatabase.get.connec.deleteFrom("company").where("id", "=", id).execute()
    }

    async createMany(companies: Company[]): Promise<void> {
        const parsedData: CompanyCreate[] = companies.map((company) => {
            return {
                id: company.id,
                name: company.name,
                description: company.description,
                logo_url: company.logoUrl,
                url: company.url,
            } as CompanyCreate
        })

        await KyselyDatabase.get.connec.insertInto("company").values(parsedData).execute()
    }

    async createOne(company: Company): Promise<void> {
        await KyselyDatabase.get.connec
            .insertInto("company")
            .values({
                id: company.id,
                name: company.name,
                description: company.description,
                logo_url: company.logoUrl,
                url: company.url,
            } as CompanyCreate)
            .execute()
    }
}
