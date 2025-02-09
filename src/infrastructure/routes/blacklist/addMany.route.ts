import express, { Request, Response } from "express";
import AddManyTextFilterUsecase, { AddManyTextFilterUsecaseimpl } from "@App/domain/usecases/textFilters/addManyTextFilters.usecase";
import { body, validationResult } from "express-validator";
import { Failure } from "@App/core/usecase";
import { basicAuth } from "@App/core/auth";

const addManyTextFilterUsecase: AddManyTextFilterUsecase = AddManyTextFilterUsecaseimpl;

const addManyTextFiltersRoute = express.Router().post(
    "/",
    body().isArray({
        min: 1,
    }),
    basicAuth,
    async (req: Request, res: Response) => {
        const validator = validationResult(req);
        if (validator.isEmpty() == false) {
            res.status(404).send(validator);
            return;
        }

        const result = await addManyTextFilterUsecase.perform({
            values: req.body as string[],
        });

        if (result instanceof Failure) {
            return res.status(result.errorCode).send(result);
        }

        res.status(200).send(result);
    }
);

export default addManyTextFiltersRoute;
