import { DetailedJobOffer } from "@App/domain/entities/detailedJobOffer.entity"
import { DetailedJobOfferFT } from "../models/detailedJobOfferFT"
import { JobOfferFT } from "../models/jobOfferFT"
import { SourceSite } from "@App/domain/enums/sourceData.enum"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"

export interface JobOfferParserFT {
    parse: (source: JobOfferFT[]) => Promise<JobOffer[]>
    parseDetailed: (source: DetailedJobOfferFT[]) => Promise<DetailedJobOffer[]>
}

export const JobOfferParserFTImpl: JobOfferParserFT = {
    parse: async function (source: JobOfferFT[]): Promise<JobOffer[]> {
        return source.map((elem) => {
            return {
                id: elem.id,
                title: elem.intitule,
                company_name: elem.entreprise.nom,
                company_logo_url: elem.entreprise.logo,
                image_url: elem.entreprise.logo,
                city_name: elem.lieuTravail.libelle,
                created_at: Date.parse(elem.dateCreation),
                updated_at: Date.parse(elem.dateActualisation),
                source_url: elem.origineOffre.urlOrigine,
                source_data: SourceSite.FTAPI,
            } as JobOffer
        })
    },

    parseDetailed: async function (source: DetailedJobOfferFT[]): Promise<DetailedJobOffer[]> {
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
                sourceUrl: elem.origineOffre.urlOrigine,
                sourceData: SourceSite.FTAPI,
                createdAt: Date.parse(elem.dateCreation),
                updatedAt: Date.parse(elem.dateActualisation),
            } as DetailedJobOffer
        })
    },
}