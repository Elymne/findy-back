import express, { Request, Response } from "express"
import { GetMunicipalitiesUsecase, GetMunicipalitiesUsecaseImpl } from "~/domain/usecases/getMunicipalities.usecase"

const router = express.Router()
const getAllMunicipalities: GetMunicipalitiesUsecase = GetMunicipalitiesUsecaseImpl

router.get("/", async (req: Request, res: Response) => {
    const result = await getAllMunicipalities.perform()
    if ("errorCode" in result && typeof result.errorCode === "number") {
        return res.status(result.errorCode).send(result)
    }
    res.status(200).send(result)
})

export default router
