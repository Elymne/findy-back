export default interface OfferDetailed {
    id: string;
    title: string;
    description: string;
    jobTitle: string;
    origin?: string;

    zone: {
        libelle: string;
        lat: number;
        lng: number;
    };

    company?: {
        name: string;
        description: string;
        logo: string;
        url: string;
    };

    tags: string[];

    salaryDetails?: {
        value: string | number;
        com?: string;
        tags?: string[];
    };

    contact?: {
        name?: string;
        coords?: string;
        phone?: string;
        mail?: string;
        com?: string;
        url?: string;
    };

    skills: string[];
    softSkills: {
        title: string;
        description: string;
    }[];

    createdAt: Date;
    updateAt?: Date;
    imgUrl?: string;
}
