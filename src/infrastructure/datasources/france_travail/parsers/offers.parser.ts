import Offer from "@App/domain/models/Offer.model";

export function parseOffers(data: OfferResultModelFT): Offer[] {
    return data.resultats.map((data) => {
        const tags: string[] = [];
        data.langues?.forEach((elem) => tags.push(elem.libelle));
        data.formations?.forEach((elem) => tags.push(`${elem.domaineLibelle} - ${elem.niveauLibelle}`));
        data.permis?.forEach((elem) => tags.push(elem.libelle));
        data.outilsBureautiques?.forEach((elem) => tags.push(elem));

        const offer: Offer = {
            id: data.id,
            title: data.intitule,
            company: data.entreprise.nom,
            companyLogo: data.entreprise.logo,
            zone: data.lieuTravail.libelle,
            jobTitle: data.appellationlibelle,
            createdAt: new Date(data.dateCreation),
            updateAt: new Date(data.dateActualisation),
            tags: tags,
            imgUrl: undefined,
            origin: undefined,
        };

        return offer;
    });
}

export interface OfferResultModelFT {
    resultats: OfferModelFT[];
}

interface OfferModelFT {
    id: string;
    intitule: string;
    entreprise: {
        nom: string;
        logo: string;
    };
    lieuTravail: {
        libelle: string;
    };
    appellationlibelle: string;
    dateCreation: string;
    dateActualisation: string;

    // tags
    formations?: {
        domaineLibelle: string;
        niveauLibelle: string;
    }[];

    langues?: {
        libelle: string;
    }[];

    permis?: {
        libelle: string;
    }[];

    outilsBureautiques: string[];

    nombrePostes?: number;
}
