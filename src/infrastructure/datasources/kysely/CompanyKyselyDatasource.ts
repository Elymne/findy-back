import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import { CompanyCreate } from "./tables/company_table"
import Company from "@App/domain/models/clean/Company.model"
import KyselyDatabase from "./db/KyselyDatabase"
import { inject, injectable } from "tsyringe"

@injectable()
export default class CompanyLocalDatasource implements CompanyLocalRepository {
    private kyselyDatabase: KyselyDatabase

    constructor(@inject("KyselyDatabase") kyselyDatabase: KyselyDatabase) {
        this.kyselyDatabase = kyselyDatabase
    }

    async findOne(id: string): Promise<Company | undefined> {
        const result = await this.kyselyDatabase.connec.selectFrom("company").selectAll().where("id", "=", id).executeTakeFirst()
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
        const results = await this.kyselyDatabase.connec.selectFrom("company").selectAll().execute()
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

    async findByName(name: string): Promise<Company | undefined> {
        const result = await this.kyselyDatabase.connec.selectFrom("company").selectAll().where("name", "=", name).executeTakeFirst()
        if (!result) return undefined

        return {
            id: result.id,
            name: result.name,
            description: result.description,
            logoUrl: result.logo_url,
            url: result.url,
        }
    }

    async deleteOne(id: string): Promise<void> {
        await this.kyselyDatabase.connec.deleteFrom("company").where("id", "=", id).execute()
    }

    async createMany(companies: Company[]): Promise<void> {
        if (companies.length == 0) {
            return
        }

        const parsedData: CompanyCreate[] = companies.map((company) => {
            return {
                id: company.id,
                name: company.name,
                description: company.description,
                logo_url: company.logoUrl,
                url: company.url,
            } as CompanyCreate
        })

        await this.kyselyDatabase.connec.insertInto("company").values(parsedData).execute()
    }

    async createOne(company: Company): Promise<void> {
        await this.kyselyDatabase.connec
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

    // TODO.
    async update(companies: Company[]): Promise<void> {
        console.log(companies)
        throw new Error("Method not implemented.")
    }
}
