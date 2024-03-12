import express, { Request, Response } from "express"
import { cacheSuccesses } from "@App/core/tools/cache"
import { GetTokenFTUsecase, GetTokenFTUsecaseImpl } from "@App/domain/usecases/getFTToken.usecase"

const router = express.Router()

const getTokenFTUsecase: GetTokenFTUsecase = GetTokenFTUsecaseImpl

router.get("/", async (req: Request, res: Response) => {
    const result = await getTokenFTUsecase.perform()

    if ("errorCode" in result && typeof result.errorCode === "number") {
        return res.status(result.errorCode).send(result)
    }

    res.status(200).send(result)
})

export default router
