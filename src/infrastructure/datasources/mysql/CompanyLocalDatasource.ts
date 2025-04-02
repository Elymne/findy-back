import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import { RowDataPacket } from "mysql2"
import { MysqlDatabase } from "./db/MysqlDatabase"
import Company from "@App/domain/models/clean/Company.model"

export default class CompanyLocalDatasource implements CompanyLocalRepository {
    async findOne(id: string): Promise<Company | undefined> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<CompanyResult[]>("SELECT * FROM company WHERE id = ?", [id])
        if (result.length == 0) {
            return undefined
        }
        return parse(result[0])
    }

    async findAll(): Promise<Company[]> {
        const [result] = await MysqlDatabase.getInstance().getConnec().query<CompanyResult[]>("SELECT * FROM company")
        return result.map((elem) => parse(elem))
    }

    async findByName(text: string): Promise<Company[]> {
        console.log(text)
        const [result] = await MysqlDatabase.getInstance().getConnec().query<CompanyResult[]>("SELECT * FROM company")
        return result.map((elem) => parse(elem))
    }

    async deleteAll(): Promise<void> {
        MysqlDatabase.getInstance().getConnec().query("DELETE FROM company")
    }

    async deleteOne(id: string): Promise<void> {
        console.log(id)
        MysqlDatabase.getInstance().getConnec().query("DELETE FROM company")
    }

    async createMany(jobs: Company[]): Promise<void> {
        const query = "INSERT INTO company(id, name, description, logo_url, url) VALUES ?"
        const values = jobs.map((elem) => {
            return [elem.id, elem.name, elem.description, elem.logoUrl, elem.url]
        })

        MysqlDatabase.getInstance().getConnec().query(query, [values])
    }

    async createOne(job: Company): Promise<void> {
        const query = "INSERT INTO company(id, name, description, logo_url, url) VALUES (?)"
        const values = [job.id, job.name, job.description, job.logoUrl, job.url]
        MysqlDatabase.getInstance().getConnec().query(query, values)
    }
}

interface CompanyResult extends RowDataPacket {
    id: string
    name: string
    description: string | undefined
    url: string | undefined
    logo_url: string | undefined
}

function parse(companyTable: CompanyResult): Company {
    return {
        id: companyTable.id,
        name: companyTable.name,
        description: companyTable.description,
        logoUrl: companyTable.logo_url,
        url: companyTable.url,
    }
}
