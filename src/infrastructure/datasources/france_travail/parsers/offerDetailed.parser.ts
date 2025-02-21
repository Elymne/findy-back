import OfferDetailed from "@App/domain/models/OfferDetailed.model";

export function parseOfferDetailed(data: OfferDetailedModelFT): OfferDetailed {
    const tags: string[] = [];
    data.langues?.forEach((elem) => tags.push(elem.libelle));
    data.formations?.forEach((elem) => tags.push(`${elem.domaineLibelle} - ${elem.niveauLibelle}`));
    data.permis?.forEach((elem) => tags.push(elem.libelle));
    data.outilsBureautiques?.forEach((elem) => tags.push(elem));

    const skills: string[] = [];
    data.competences?.forEach((elem) => skills.push(`${elem.libelle} - ${elem.exigence}`));

    const softSkills: {
        title: string;
        description: string;
    }[] = [];
    data.qualitesProfessionnelles?.forEach((elem) =>
        softSkills.push({
            title: elem.libelle,
            description: elem.description,
        })
    );

    const contact = data.contact
        ? {
              name: data.contact?.nom ?? "Unknown",
              com: data.contact?.commentaire ?? "Unknown",
              coords: data.contact?.coordonnees1 ?? "Unknown",
              mail: data.contact?.courriel ?? "Unknown",
              phone: data.contact?.telephone ?? "Unknown",
              url: data.contact?.urlPostulation ?? "Unknown",
          }
        : undefined;

    const company = data.entreprise
        ? {
              name: data.entreprise.nom,
              description: data.entreprise.description,
              logo: data.entreprise.logo,
              url: data.entreprise.url,
          }
        : undefined;
    const zone = {
        libelle: data.lieuTravail.libelle,
        lat: data.lieuTravail.latitude,
        lng: data.lieuTravail.longitude,
    };

    const offer: OfferDetailed = {
        id: data.id,
        title: data.intitule,
        description: data.description,
        origin: data.origineOffre.urlOrigine,
        jobTitle: data.appellationlibelle,
        createdAt: new Date(data.dateCreation),
        updateAt: new Date(data.dateActualisation),
        zone: zone,
        company: company,
        // ! Fuck France travail, bande de shlagos.
        contact: contact,
        tags: tags,
        skills: skills,
        softSkills: softSkills,
        salaryDetails: {
            value: data.salaire.libelle,
            com: data.salaire.commentaire,
            tags: [data.salaire.complement1, data.salaire.complement2],
        },
    };

    return offer;
}

export interface OfferDetailedModelFT {
    id: string;
    intitule: string;
    description: string;
    dateCreation: string;
    dateActualisation: string;
    lieuTravail: {
        libelle: string;
        latitude: number;
        longitude: number;
        codePostal: number;
        commune: number;
    };
    romeCode: string;
    romeLibelle: string;
    appellationlibelle: string;
    entreprise: {
        nom: string;
        description: string;
        logo: string;
        url: string;
        entrepriseAdaptee: boolean;
    };
    typeContrat: string;
    typeContratLibelle: string;
    natureContrat: string;
    experienceExige: string;
    experienceLibelle: string;
    experienceCommentaire: string;
    formations: {
        codeFormation: number;
        domaineLibelle: string;
        niveauLibelle: string;
        commentaire: string;
        exigence: string;
    }[];
    langues: {
        libelle: string;
        exigence: string;
    }[];
    permis: {
        libelle: string;
        exigence: string;
    }[];
    outilsBureautiques: string[];
    competences?: {
        code: number;
        libelle: string;
        exigence: string;
    }[];
    salaire: {
        libelle: string;
        commentaire: string;
        complement1: string;
        complement2: string;
    };
    dureeTravailLibelle: string;
    dureeTravailLibelleConverti: string;
    complementExercice: string;
    conditionExercice: string;
    alternance: boolean;
    contact?: {
        nom: string | undefined;
        coordonnees1: string | undefined;
        coordonnees2: string | undefined;
        coordonnees3: string | undefined;
        telephone: string | undefined;
        courriel: string | undefined;
        commentaire: string | undefined;
        urlRecruteur: string | undefined;
        urlPostulation: string | undefined;
    };
    agence: {
        telephone: string;
        courriel: string;
    };
    nombrePostes: number;
    accessibleTH: boolean;
    deplacementCode: number;
    deplacementLibelle: string;
    qualificationCode: number;
    qualificationLibelle: string;
    codeNAF: string;
    secteurActivite: number;
    secteurActiviteLibelle: string;
    qualitesProfessionnelles?: {
        libelle: string;
        description: string;
    }[];
    trancheEffectifEtab: string;
    origineOffre: {
        origine: number;
        urlOrigine: string;
        partenaires: number[];
    };
    offresManqueCandidats: boolean;
    contexteTravail: {
        horaires: string;
        conditionsExercice: string;
    };
}
