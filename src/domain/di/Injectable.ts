export type Injectable = Respositories | Usecases;

export enum Respositories {
    OfferRepository = "OfferRepository",
    ZoneRepository = "ZoneRepository",
    SchoolRepository = "SchoolRepository",
}

export enum Usecases {
    GetOffersFromSearch = "GetOffersFromSearch",
}
