import TextFilter from "@App/domain/entities/textFilter.entity"
import FilterPageOffersUsecase, { FilterPageOffersUsecaseImpl } from "@App/domain/usecases/jobsOffers/filterPageOffers.usecase"

const filterPageOffersUsecase: FilterPageOffersUsecase = {
    textFilterDatasource: {
        findAll: jest.fn(),
        addOne: jest.fn(),
        addAll: jest.fn(),
    },
    jobOfferHistoryDatasource: {
        findManyBySourceType: jest.fn(),
        findOne: jest.fn(),
        addMany: jest.fn(),
    },
    perform: FilterPageOffersUsecaseImpl.perform,
}

const textFilters: TextFilter[] = [
    { id: "1", value: "ISCOD" },
    { id: "2", value: "ISCOD" },
    { id: "3", value: "ISCOD" },
    { id: "4", value: "ISCOD" },
    { id: "5", value: "ISCOD" },
]

describe("T1", () => {
    // ;(filterPageOffersUsecase.textFilterDatasource.findAll as jest.Mock).mockReturnValue(new Promise(()))

    test("Working test launch.", async () => {
        expect(true).toBe(true)
    })
})
