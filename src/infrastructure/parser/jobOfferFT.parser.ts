import { DetailedJobOffer } from "@App/domain/entities/detailedJobOffer.entity"
import { DetailedJobOfferFT } from "../datasources/ftapi/models/detailedJobOfferFT"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"
import { SourceData } from "@App/domain/entities/enums/sourceData.enum"
import { JobOffer } from "@App/domain/entities/jobOffer.entity"

export interface JobOfferParserFT {
    parseDetailed: (source: DetailedJobOfferFT[]) => Promise<DetailedJobOffer[]>
    parse: (source: JobOfferFT[]) => Promise<JobOffer[]>
}

export const JobOfferParserFTImpl: JobOfferParserFT = {
    parse: async function (source: JobOfferFT[]): Promise<JobOffer[]> {
        return source.map((elem) => {
            return {
                id: elem.id,
                title: elem.intitule,
                company_name: elem.entreprise.nom,
                company_logo_url: elem.entreprise.logo,
                city_name: elem.lieuTravail.commune,
                image_url: "FranceTravailPlaceholder",
                created_at: Date.parse(elem.dateCreation),
                updated_at: Date.parse(elem.dateActualisation),
                source_url: elem.origineOffre.urlOrigine,
                source_data: SourceData.FTAPI,
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
                sourceData: SourceData.FTAPI,
                createdAt: Date.parse(elem.dateCreation),
                updatedAt: Date.parse(elem.dateActualisation),
            } as DetailedJobOffer
        })
    },
}
