/* eslint-disable  @typescript-eslint/no-explicit-any */
import { JobOffer, offerSource } from "~/domain/entities/jobOffer.entity"
import { JobOfferFT } from "../datasources/ftapi/models/jobOfferFT"

export interface JobOfferParser {
    parseFT: (source: JobOfferFT[]) => Promise<JobOffer[]>
}

export const JobOfferParserImpl: JobOfferParser = {
    parseFT: async function (source: JobOfferFT[]): Promise<JobOffer[]> {
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
                source: offerSource.FranceTravail,
                createdAt: Date.parse(elem.dateCreation),
                updatedAt: Date.parse(elem.dateActualisation),
            } as JobOffer
        })
    },
}
