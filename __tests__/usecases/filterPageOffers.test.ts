import { Failure, Success } from "@App/core/usecaseupdate";
import JobOffer from "@App/domain/models/jobOffer.entity";
import JobOfferHistory from "@App/domain/models/jobOfferHistory";
import TextFilter from "@App/domain/models/textFilter.entity";
import SourceSite from "@App/domain/enums/sourceData.enum";
import FilterPageOffersUsecase, { FilterPageOffersUsecaseImpl } from "@App/domain/usecases/jobsOffers/filterPageOffers.usecase";
import JobOfferHistoryModel from "@App/infrastructure/local/mongoDb/models/JobOfferHistory.model";

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
};

const findAllTextFilters = filterPageOffersUsecase.textFilterDatasource.findAll as jest.Mock<Promise<TextFilter[]>>;
const findManyJobOfferHistories = filterPageOffersUsecase.jobOfferHistoryDatasource.findManyBySourceType as jest.Mock<Promise<JobOfferHistory[]>>;
const addManyJobOfferHistories = filterPageOffersUsecase.jobOfferHistoryDatasource.addMany as jest.Mock<Promise<void>>;

describe("Testing filterPageOffersUsecase perform function.", () => {
    afterEach(() => {
        findAllTextFilters.mockReset();
        findManyJobOfferHistories.mockReset();
        addManyJobOfferHistories.mockReset();
    });

    test("Return an instance of Success with 2 job offers. No data from jobOfferHistoryDatasource.", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    { id: crypto.randomUUID(), value: "ISCOD" },
                    { id: crypto.randomUUID(), value: "MARKETING SCHOOL" },
                ]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [
                    createQuickJobOffer({
                        companyName: "ISCOD",
                    }),
                    createQuickJobOffer({}),
                    createQuickJobOffer({
                        companyName: "from ISCOD school",
                    }),
                    createQuickJobOffer({
                        title: "new offer for MARKETING SCHOOL oh yeah.",
                    }),
                    createQuickJobOffer({}),
                ],
            },
        });

        expect(result instanceof Success).toBe(true);
        expect(result.data.jobOffers.length).toBe(2);
    });

    test("Add 5 new elements with addManyJobOfferHistories function", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        addManyJobOfferHistories.mockImplementation(async (values: JobOfferHistoryModel[]): Promise<void> => {
            expect(values).toBe(5);
        });

        await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [
                    createQuickJobOffer({
                        companyName: "ISCOD",
                    }),
                    createQuickJobOffer({}),
                    createQuickJobOffer({
                        companyName: "from ISCOD school",
                    }),
                    createQuickJobOffer({
                        title: "new offer for MARKETING SCHOOL oh yeah.",
                    }),
                    createQuickJobOffer({}),
                ],
            },
        });
    });

    test("Return an instance of Success with 0 job offers. No data from jobOfferHistoryDatasource.", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    { id: crypto.randomUUID(), value: "ISCOD" },
                    { id: crypto.randomUUID(), value: "MARKETING SCHOOL" },
                ]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [],
            },
        });

        expect(result instanceof Success).toBe(true);
        expect(result.data.jobOffers.length).toBe(0);
    });

    test("Add 0 new elements with addManyJobOfferHistories function", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([]);
            })
        );

        addManyJobOfferHistories.mockImplementation(async (values: JobOfferHistoryModel[]): Promise<void> => {
            expect(values).toBe(0);
        });

        await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [],
            },
        });
    });

    test("Return an instance of Failure because findAllTextFilters function has failed", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise(() => {
                throw Error("Error");
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [],
            },
        });

        expect(result instanceof Failure).toBe(true);
    });

    test("Return an instance of Failure because findManyJobOfferHistories function has failed", async () => {
        findManyJobOfferHistories.mockReturnValue(
            new Promise(() => {
                throw Error("Error");
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [],
            },
        });

        expect(result instanceof Failure).toBe(true);
    });

    test("Return an instance of Failure because addManyJobOfferHistories function has failed", async () => {
        addManyJobOfferHistories.mockReturnValue(
            new Promise(() => {
                throw Error("Error");
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [],
            },
        });

        expect(result instanceof Failure).toBe(true);
    });

    test("Return an instance of success with 2 job offers. Data are loaded from jobOfferHistoryDatasource.", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    { id: crypto.randomUUID(), value: "ISCOD" },
                    { id: crypto.randomUUID(), value: "MARKETING SCHOOL" },
                ]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    {
                        id: crypto.randomUUID(),
                        isBanned: false,
                        source: "source_1",
                        sourceSite: SourceSite.hw,
                    },
                    {
                        id: crypto.randomUUID(),
                        isBanned: true,
                        source: "source_2",
                        sourceSite: SourceSite.hw,
                    },
                ]);
            })
        );

        const result = await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [
                    createQuickJobOffer({
                        companyName: "ISCOD",
                    }),
                    createQuickJobOffer({
                        sourceUrl: "source_1",
                    }),
                    createQuickJobOffer({
                        companyName: "from ISCOD school",
                    }),
                    createQuickJobOffer({
                        title: "new offer for MARKETING SCHOOL oh yeah.",
                    }),
                    createQuickJobOffer({
                        sourceUrl: "source_2",
                    }),
                    createQuickJobOffer({}),
                ],
            },
        });

        expect(result instanceof Success).toBe(true);
        expect(result.data.jobOffers.length).toBe(2);
    });

    test("Add 4 new elements with addManyJobOfferHistories function", async () => {
        findAllTextFilters.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    { id: crypto.randomUUID(), value: "ISCOD" },
                    { id: crypto.randomUUID(), value: "MARKETING SCHOOL" },
                ]);
            })
        );

        findManyJobOfferHistories.mockReturnValue(
            new Promise((resolve) => {
                resolve([
                    {
                        id: crypto.randomUUID(),
                        isBanned: false,
                        source: "source_1",
                        sourceSite: SourceSite.hw,
                    },
                    {
                        id: crypto.randomUUID(),
                        isBanned: false,
                        source: "source_2",
                        sourceSite: SourceSite.hw,
                    },
                ]);
            })
        );

        addManyJobOfferHistories.mockImplementation(async (values: JobOfferHistoryModel[]) => {
            expect(values).toBe(4);
        });

        await filterPageOffersUsecase.perform({
            sourceSite: SourceSite.hw,
            sources: {
                totalPagesNb: 1,
                jobOffers: [
                    createQuickJobOffer({
                        companyName: "ISCOD",
                    }),
                    createQuickJobOffer({
                        sourceUrl: "source_1",
                    }),
                    createQuickJobOffer({
                        companyName: "from ISCOD school",
                    }),
                    createQuickJobOffer({
                        title: "new offer for MARKETING SCHOOL oh yeah.",
                    }),
                    createQuickJobOffer({
                        sourceUrl: "source_2",
                    }),
                    createQuickJobOffer({}),
                ],
            },
        });
    });
});

/**
 * Allowme to create job offers quickly for my tests.
 */
function createQuickJobOffer(params: { title?: string; companyName?: string; sourceSite?: SourceSite; sourceUrl?: string }): JobOffer {
    return {
        title: params.title ?? "Potatoe",
        companyName: params.companyName ?? "Super Company",
        cityName: "Here",
        sourceSite: params.sourceSite ?? SourceSite.wttj,
        sourceUrl: params.sourceUrl ?? "No one",
        companyLogoUrl: "logo.png",
        imageUrl: "image.url",
    };
}
