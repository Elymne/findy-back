import { Failure, Result, Success, SuccessType } from "@App/core/Result"
import { UsecaseNoParams } from "@App/core/Usecase"
import Zone from "@App/domain/models/Zone.model"
import ZoneLocalRepository from "@App/domain/repositories/ZoneLocal.repository"

export default class GetZones extends UsecaseNoParams<Zone[]> {
    private zoneLocalRepository: ZoneLocalRepository

    public constructor(zoneLocalRepository: ZoneLocalRepository) {
        super()
        this.zoneLocalRepository = zoneLocalRepository
    }

    public async perform(): Promise<Result<Zone[]>> {
        try {
            const result = await this.zoneLocalRepository.findAll()
            if (result.length == 0) {
                return new Success(204, `[${this.constructor.name}] Trying to fetch zones : none found (odd behavior).`, result, SuccessType.WARNING)
            }
            return new Success(200, `[${this.constructor.name}] Trying to fetch zones : success`, result)
        } catch (trace) {
            return new Failure(500, `[${this.constructor.name}] Trying to fetch zones : An exception has been thrown.`, { message: "An internal error occured while fetching zones" }, trace)
        }
    }
}
