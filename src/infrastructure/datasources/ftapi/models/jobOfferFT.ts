export interface JobOfferFTResponseBody {
    resultats: JobOfferFT[]
}

export interface JobOfferFT {
    id: string
    intitule: string
    description: string
    dateCreation: string
    dateActualisation: string
    lieuTravail: {
        libelle: string
        latitude: number
        longitude: number
        codePostal: string
        commune: string
    }
    romeCode: string
    romeLibelle: string
    appellationlibelle: string
    entreprise: {
        nom: string
        description: string
        logo: string
        url: string
    }
    typeContrat: string
    typeContratLibelle: string
    natureContrat: string
    experienceExige: string
    experienceLibelle: string
    experienceCommentaire: string
    formations: [
        {
            codeFormation: string
            domaineLibelle: string
            niveauLibelle: string
            commentaire: string
            exigence: string
        }
    ]
    langues: [
        {
            libelle: string
            exigence: string
        }
    ]
    permis: [
        {
            libelle: string
            exigence: string
        }
    ]
    outilsBureautiques: string[]
    competences?: [
        {
            code: string
            libelle: string
            exigence: string
        }
    ]
    salaire: {
        libelle: string
        commentaire: string
        complement1: string
        complement2: string
    }
    dureeTravailLibelle: string
    dureeTravailLibelleConverti: string
    complementExercice: string
    conditionExercice: string
    alternance: boolean
    contact: {
        nom: string
        coordonnees1: string
        coordonnees2: string
        coordonnees3: string
        telephone: string
        courriel: string
        commentaire: string
        urlRecruteur: string
        urlPostulation: string
    }
    agence: {
        telephone: string
        courriel: string
    }
    nombrePostes: number
    accessibleTH: boolean
    deplacementCode: string
    deplacementLibelle: string
    qualificationCode: string
    qualificationLibelle: string
    secteurActivite: string
    secteurActiviteLibelle: string
    qualitesProfessionnelles?: [
        {
            libelle: string
            description: string
        }
    ]
    trancheEffectifEtab: string
    origineOffre: {
        origine: string
        urlOrigine: string
        partenaires: [
            {
                nom: string
                url: string
                logo: string
            }
        ]
    }
}
