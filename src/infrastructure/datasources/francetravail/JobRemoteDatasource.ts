import Job from "@App/domain/models/Job.model"
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository"
import generateToken from "./generateToken"
import axios, { AxiosRequestConfig } from "axios"

/**
 * Implemntation of JobRemoteRepository to France Travail Jobs datasource.
 */
export default class JobRemoteDatasource implements JobRemoteRepository {
    /**
     * Fetch all data from France Travail Jobs Datasource.
     * This function needs @function generateToken() to generate the tokken needed for France Travail API usage.
     * @link https://francetravail.io/produits-partages/catalogue/offres-emploi/documentation#/api-reference/operations/recupererReferentielSecteursActivites
     * @returns {Promise<Job[]>}
     */
    async findAll(): Promise<Job[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `https://api.francetravail.io/partenaire/offresdemploi/v2/referentiel/secteursActivites`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        }

        const response = await axios.request<JobModel[]>(options)
        if (response.status != 206 && response.status != 200) {
            return []
        }

        return response.data.map((data) => {
            return {
                id: data.code,
                title: data.libelle,
            }
        })
    }
}

/**
 * Structure of JSON data from France Travail API response.
 * Usage : Parse data from France Travail jobs API.
 */
interface JobModel {
    code: string
    libelle: string
}
