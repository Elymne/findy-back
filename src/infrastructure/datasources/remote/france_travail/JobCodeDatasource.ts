import Job from "@App/domain/models/Job.model"
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository"
import generateToken from "./generateToken"
import axios, { AxiosRequestConfig } from "axios"

export default class JobRemoteDatasource implements JobRemoteRepository {
    async findAll(): Promise<Job[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v2/referentiel/secteursActivites`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        }

        const response = await axios.request<JobModelFT[]>(options)

        if (response.status != 206 && response.status != 200) {
            return []
        }

        return response.data.map((data) => {
            return {
                code: data.code,
                title: data.libelle,
            }
        })
    }

    async findOne(code: string): Promise<Job> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v1/metiers/secteur-activite/${code}`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        }

        const response = await axios.request<JobModelFT>(options)

        return {
            code: response.data.code,
            title: response.data.libelle,
        }
    }
}

const baseUrl = "https://api.francetravail.io/partenaire/offresdemploi"

interface JobModelFT {
    code: string
    libelle: string
}
