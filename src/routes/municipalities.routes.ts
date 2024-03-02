import express, { Request, Response } from "express"
import { cacheSuccesses } from "@App/core/tools/cache"
import { GetCitiesUsecase, GetCitiesUsecaseImpl } from "@App/domain/usecases/city/getCities.usecase"

const router = express.Router()
const getAllMunicipalities: GetCitiesUsecase = GetCitiesUsecaseImpl

router.get("/", cacheSuccesses, async (req: Request, res: Response) => {
    const result = await getAllMunicipalities.perform()
    if ("errorCode" in result && typeof result.errorCode === "number") {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default router
