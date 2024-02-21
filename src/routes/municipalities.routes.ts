import express, { Request, Response } from "express"
import { Failure, Success } from "~/core/usecase"
import { Municipality } from "~/domain/entities/municipality.entity"
import { GetMunicipalities, GetMunicipalitiesImpl } from "~/domain/usecases/getMunicipalities.usecase"

const router = express.Router()
const getAllMunicipalities: GetMunicipalities = GetMunicipalitiesImpl

router.get("/", async (req: Request, res: Response) => {
    const result = await getAllMunicipalities.perform()

    if ("errorCode" in result) {
        return res.status(500).send(result as Failure<Municipality[]>)
    }

    res.status(200).send(result as Success<Municipality[]>)
})

export default router
