import { Usecase } from "@App/core/interfaces/abstract.usecase"

type AddManyTextFilterUsecaseParams = {
    value: string
}

export default interface AddManyTextFilterUsecase extends Usecase<void, AddManyTextFilterUsecaseParams> {}
