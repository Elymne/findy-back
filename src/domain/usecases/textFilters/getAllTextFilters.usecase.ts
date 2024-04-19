import { UsecaseNoParams } from "@App/core/interfaces/abstract.usecase"
import TextFilter from "@App/domain/entities/textFilter.entity"

export default interface GetAllTextFiltersUsecase extends UsecaseNoParams<TextFilter[]> {}
