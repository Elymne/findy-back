import { container } from "tsyringe"
import KyselyDatabase from "@App/infrastructure/datasources/kysely/db/KyselyDatabase"
import CompanyKyselyDatasource from "@App/infrastructure/datasources/kysely/CompanyKyselyDatasource"
import OfferKyselyDatasource from "@App/infrastructure/datasources/kysely/OfferKyselyDatasource"
import JobKyselyDatasource from "@App/infrastructure/datasources/kysely/JobKyselyDatasource"
import ZoneKyselyDatasource from "@App/infrastructure/datasources/kysely/ZoneKyselyDatasource"
import GeoApiDatasource from "@App/infrastructure/datasources/geoapi/GeoApiDatasource"
import HelloworkDatasource from "@App/infrastructure/datasources/scrappers/hellowork/HelloworkDatasource"
import JobFTDatasource from "@App/infrastructure/datasources/francetravail/JobFTDatasource"
import OfferFTDatasource from "@App/infrastructure/datasources/francetravail/OfferFTDatasource"
import GetJobByID from "@App/domain/usecases/fetching/GetJobByID.usecase"
import GetJobs from "@App/domain/usecases/fetching/GetJobs.usecase"
import GetOffersFromSearch from "@App/domain/usecases/fetching/GetOffersFromSearch.usecase"
import GetOneOffer from "@App/domain/usecases/fetching/GetOneOffer.usecase"
import GetSample from "@App/domain/usecases/fetching/GetSample"
import GetZoneByID from "@App/domain/usecases/fetching/GetZoneByID.usecase"
import GetZones from "@App/domain/usecases/fetching/GetZones.usecase"
import ParseOffersScrap from "@App/domain/usecases/parsing/ParseOffersScrap.usecase"
import ExpressServer from "@App/infrastructure/express/ExpressServer"
import RunServer from "@App/domain/usecases/running/RunServer.usecase"
import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase"
import ScrapSite from "@App/domain/usecases/scrapping/ScrapSite.usecase"
import UpdateJobs from "@App/domain/usecases/storing/UpdateJobs.usecase"
import UpdateZone from "@App/domain/usecases/storing/UpdateZones.usecase"
import UpdateOffers from "@App/domain/usecases/storing/UpdateOffers.usecase"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"
import OfferLocalRepository from "@App/domain/repositories/OfferLocal.repository"
import JobLocalRepository from "@App/domain/repositories/JobLocal.repository"
import CompanyLocalRepository from "@App/domain/repositories/CompanyLocalRepository"
import ZoneRemoteRepository from "@App/domain/repositories/ZoneRemote.repository"
import JobRemoteRepository from "@App/domain/repositories/JobRemote.repository"
import OfferRemoteRepository from "@App/domain/repositories/OfferRemote.repository"
import IServer from "@App/domain/gateways/IServer.gateways"
import IDatabase from "@App/domain/gateways/IDatabase.gateways"

export const IServer = "IServer"
export const IDatabase = "IDatabase"

export const CompanyLocalRepository = "CompanyLocalRepository"
export const JobLocalRepository = "JobLocalRepository"
export const ZoneLocalRepository = "ZoneLocalRepository"
export const OfferLocalRepository = "OfferLocalRepository"

export const ZoneRemoteRepository = "ZoneRemoteRepository"
export const JobRemoteRepository = "JobRemoteRepository"
export const OfferRemoteRepository = "OfferRemoteRepository"

export const HelloworkRepository = "HelloworkRepository"

export const ScrapHelloworkPage = "ScrapHelloworkPage"
export const ScrapHelloworkSite = "ScrapHelloworkSite"

export default function runContainer(): void {
    // Gateways
    container.register(IServer, { useValue: new ExpressServer() })
    container.register(IDatabase, { useValue: KyselyDatabase.get })

    // Local Repositories.
    container.register(CompanyLocalRepository, {
        useValue: new CompanyKyselyDatasource(container.resolve(IDatabase)),
    })
    container.register(JobLocalRepository, {
        useValue: new JobKyselyDatasource(container.resolve(IDatabase)),
    })
    container.register(ZoneLocalRepository, {
        useValue: new OfferKyselyDatasource(container.resolve(IDatabase)),
    })
    container.register(OfferLocalRepository, {
        useValue: new ZoneKyselyDatasource(container.resolve(IDatabase)),
    })

    // Remote repositories
    container.register(ZoneRemoteRepository, {
        useValue: new GeoApiDatasource(),
    })
    container.register(JobRemoteRepository, {
        useValue: new JobFTDatasource(),
    })
    container.register(OfferRemoteRepository, {
        useValue: new OfferFTDatasource(),
    })

    // Srcapper repositories.
    container.register(HelloworkRepository, {
        useValue: new HelloworkDatasource(),
    })

    // Usecases Local.
    container.register(GetJobByID, {
        useValue: new GetJobByID(container.resolve(JobLocalRepository)),
    })
    container.register(GetJobs, {
        useValue: new GetJobs(container.resolve(JobLocalRepository)),
    })

    container.register(GetOffersFromSearch, {
        useValue: new GetOffersFromSearch(container.resolve(OfferLocalRepository)),
    })

    container.register(GetOneOffer, {
        useValue: new GetOneOffer(container.resolve(OfferLocalRepository)),
    })

    container.register(GetSample, {
        useValue: new GetSample(container.resolve(OfferLocalRepository)),
    })

    container.register(GetZoneByID, {
        useValue: new GetZoneByID(container.resolve(ZoneLocalRepository)),
    })
    container.register(GetZones, {
        useValue: new GetZones(container.resolve(ZoneLocalRepository)),
    })

    // Usecases Server.

    container.register(RunServer, {
        useValue: new RunServer(container.resolve(IServer), container.resolve(IDatabase)),
    })

    // Usecases Parsers.

    container.register<ParseOffersScrap>(ParseOffersScrap, {
        useValue: new ParseOffersScrap(container.resolve(CompanyLocalRepository), container.resolve(ZoneLocalRepository)),
    })

    // Usecases Scrapers.

    container.register(ScrapHelloworkPage, {
        useValue: new ScrapOnePage(container.resolve(HelloworkRepository)),
    })

    container.register(ScrapHelloworkSite, {
        useValue: new ScrapSite(container.resolve(ScrapHelloworkPage)),
    })

    // Usecases Updaters.

    container.register(UpdateJobs, {
        useValue: new UpdateJobs(container.resolve(JobLocalRepository), container.resolve(JobRemoteRepository)),
    })

    container.register(UpdateZone, {
        useValue: new UpdateZone(container.resolve(ZoneLocalRepository), container.resolve(ZoneRemoteRepository)),
    })

    container.register(UpdateOffers, {
        useValue: new UpdateOffers(
            [container.resolve(ScrapHelloworkSite)],
            container.resolve(ParseOffersScrap),
            container.resolve(JobLocalRepository),
            container.resolve(CompanyLocalRepository),
            container.resolve(OfferLocalRepository)
        ),
    })
}
