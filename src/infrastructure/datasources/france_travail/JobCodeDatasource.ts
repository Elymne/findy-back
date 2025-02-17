import Job from "@App/domain/models/Job.model";
import JobCodeRepository from "@App/domain/repositories/Job.repository";
import generateToken from "./FranceTravailDatasource";
import axios, { AxiosRequestConfig } from "axios";

export default class JobDatasource implements JobCodeRepository {
    async findAll(): Promise<Job[]> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v1/metiers/secteur-activite`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        };

        const response = await axios.request<JobModelFT[]>(options);

        if (response.status != 206 && response.status != 200) {
            return [];
        }

        return response.data.map((data) => {
            return {
                code: data.code,
                title: data.libelle,
            };
        });
    }

    async findOne(code: string): Promise<Job> {
        const options: AxiosRequestConfig = {
            method: "GET",
            url: `${baseUrl}/v1/metiers/secteur-activite/${code}`,
            headers: {
                Authorization: `Bearer ${await generateToken()}`,
                Accept: "application/json",
            },
        };

        const response = await axios.request<JobModelFT>(options);

        return {
            code: response.data.code,
            title: response.data.libelle,
        };
    }
}

const baseUrl = "https://api.francetravail.io/partenaire/rome-metiers";

interface JobModelFT {
    code: string;
    libelle: string;
}
