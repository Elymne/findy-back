export default interface Offer {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    zone: string;
    jobTitle: string | undefined;

    tags: string[];

    createdAt: Date;
    updateAt: Date | undefined;
    imgUrl: string | undefined;

    origin: OfferOrigin | undefined;
}

export enum OfferOrigin {
    HELLOWORK,
    INDEED,
    FRANCE_TRAVAIL,
    // GOOGLE,
    // LINKEDIN,
    // MONSTER,
    // APEC,
    // CADREMPLOI,
    // JOBIJOBA
}
