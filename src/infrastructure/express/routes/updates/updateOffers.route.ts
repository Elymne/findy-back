import express, { Request, Response } from "express"
import { Failure, Success } from "@App/core/Result"
import UpdateOffers from "@App/domain/usecases/storing/UpdateOffers.usecase"
import ScrapSite from "@App/domain/usecases/scrapping/ScrapSite.usecase"
import ScrapOnePage from "@App/domain/usecases/scrapping/ScrapOnePage.usecase"
import HelloworkDatasource from "@App/infrastructure/datasources/scrappers/hellowork/HelloworkDatasource"
import ParseOffersScrap from "@App/domain/usecases/parsing/ParseOffersScrap.usecase"
import JobLocalDatasource from "@App/infrastructure/datasources/kysely/JobKyselyDatasource"
import ZoneLocalDatasource from "@App/infrastructure/datasources/kysely/ZoneKyselyDatasource"
import CompanyLocalDatasource from "@App/infrastructure/datasources/kysely/CompanyKyselyDatasource"
import OfferLocalDatasource from "@App/infrastructure/datasources/kysely/OfferKyselyDatasource"

// TODO : I need a container to make good looking DI.

const jobLocalRepository = new JobLocalDatasource()
const zoneLocalRepository = new ZoneLocalDatasource()
const companyLocalRepository = new CompanyLocalDatasource()
const offerLocalRepository = new OfferLocalDatasource()

const scrapHelloworkPage = new ScrapOnePage(new HelloworkDatasource())
const scrapHelloworkSite = new ScrapSite(scrapHelloworkPage)

const parseOfferScrap = new ParseOffersScrap(companyLocalRepository, zoneLocalRepository)

const updateOffer = new UpdateOffers([scrapHelloworkSite], parseOfferScrap, jobLocalRepository, companyLocalRepository, offerLocalRepository)

export const updateOffersRoute = express.Router().get("/offers", async (req: Request, res: Response) => {
    const result = await updateOffer.perform()
    if (result instanceof Failure) {
        res.status(result.code).send(result.error)
        return
    }

    if (result instanceof Success) {
        res.status(result.code).send(result.data)
        return
    }

    res.status(result.code).send({ message: "Unknown type of result." })
})
