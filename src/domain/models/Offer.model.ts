export default interface Offer {
    id: string
    title: string
    company: string

    zone: string
    jobTitle: string | undefined

    tags: string[]

    companyLogoUrl: string | undefined
    imgUrl: string | undefined

    createdAt: Date
    updateAt: Date | undefined

    origin: OfferOrigin | undefined
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
