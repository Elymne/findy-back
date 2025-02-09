import { SchoolDatasource } from "@App/infrastructure/datasources/SchoolDatasource";
import { Container } from "./Container";
import { Respositories, Usecases } from "./Injectable";
import { GeoApiDatasource } from "@App/infrastructure/datasources/GeoApiDatasource";
import { FranceTravailDatasource } from "@App/infrastructure/datasources/FranceTravailDatasource";
import { GetOffersFromSearchImpl } from "../usecases/GetOffersFromSearch.usecase";

export default function buildContainer() {
    console.log("MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE MERDE ");

    buildRepositories();
    buildUsecases();
}

function buildRepositories(): void {
    Container.add(Respositories.OfferRepository, () => {
        return FranceTravailDatasource;
    });

    Container.add(Respositories.ZoneRepository, () => {
        return GeoApiDatasource;
    });

    Container.add(Respositories.SchoolRepository, () => {
        return SchoolDatasource;
    });
}

function buildUsecases(): void {
    Container.add(Usecases.GetOffersFromSearch, () => {
        return GetOffersFromSearchImpl;
    });
}
