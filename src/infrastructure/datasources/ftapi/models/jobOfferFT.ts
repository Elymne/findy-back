export interface JobOfferFTResponseBody {
    resultats: JobOfferFT[]
}

export interface JobOfferFT {
    id: string
    intitule: string
    dateCreation: string
    dateActualisation: string
    lieuTravail: {
        libelle: string
        commune: string
    }
    entreprise: {
        nom: string
        logo: string
    }
    typeContrat: string
    typeContratLibelle: string
    natureContrat: string
    alternance: boolean
    origineOffre: {
        urlOrigine: string
    }
}
