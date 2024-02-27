import { DetailedJobOffer } from "~/domain/entities/detailedJobOffer.entity"
import { DetailedJobOfferFT } from "../datasources/ftapi/models/detailedJobOfferFT"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"
import { JobOffer } from "~/domain/entities/jobOffer.entity"

export interface JobOfferParser {
    parseDetailedFT: (source: DetailedJobOfferFT[]) => Promise<DetailedJobOffer[]>
    parseFT: (source: JobOfferFT[]) => Promise<JobOffer[]>
}

export const JobOfferParserImpl: JobOfferParser = {
    parseFT: async function (source: JobOfferFT[]): Promise<JobOffer[]> {
        return source.map((elem) => {
            return {
                id: elem.id,
                title: elem.intitule,
                companyName: elem.entreprise.nom,
                companyLogoUrl: elem.entreprise.logo,
                cityName: elem.lieuTravail.commune,
                imageUrl: "FranceTravailPlaceholder",
                createdAt: Date.parse(elem.dateCreation),
                updatedAt: Date.parse(elem.dateActualisation),
                sourceUrl: elem.origineOffre.urlOrigine,
                createdWhile: undefined,
            } as JobOffer
        })
    },

    parseDetailedFT: async function (source: DetailedJobOfferFT[]): Promise<DetailedJobOffer[]> {
        return source.map((elem) => {
            return {
                id: elem.id,
                title: elem.appellationlibelle,
                jobDomain: elem.appellationlibelle,
                description: elem.description,
                contractType: elem.typeContrat,
                contractDescription: elem.typeContratLibelle,
                salaryDescription: elem.salaire.libelle,
                workOffice: {
                    name: elem.lieuTravail.libelle,
                    zone: elem.lieuTravail.commune,
                    postalcode: elem.lieuTravail.codePostal,
                    long: elem.lieuTravail.longitude,
                    lat: elem.lieuTravail.latitude,
                },
                company: {
                    name: elem.entreprise.nom,
                    description: elem.entreprise.description,
                    websiteUrl: elem.entreprise.url,
                    logoUrl: elem.entreprise.logo,
                },
                contact: {
                    name: elem.contact.nom,
                    access: elem.contact.courriel,
                },
                expRequirement: {
                    code: elem.experienceExige,
                    description: elem.experienceLibelle,
                },
                softSkills: elem.qualitesProfessionnelles?.map((qp) => {
                    return {
                        title: qp.libelle,
                        description: qp.description,
                    }
                }),
                skills: elem.competences?.map((c) => {
                    return {
                        code: c.code,
                        description: c.libelle,
                        requirementCode: c.exigence,
                    }
                }),
                origineUrl: elem.origineOffre.urlOrigine,

                createdAt: Date.parse(elem.dateCreation),
                updatedAt: Date.parse(elem.dateActualisation),
            } as DetailedJobOffer
        })
    },
}
