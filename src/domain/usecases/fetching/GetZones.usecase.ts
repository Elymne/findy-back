import { failed, Result, succeed, SuccessType } from "@App/core/Result"
import { Usecase } from "@App/core/Usecase"
import Zone from "@App/domain/models/Zone.model"
import ZoneRemoteRepository from "@App/domain/repositories/ZoneRemote.repository"

export interface GetZonesParams {
    text: string
}

export default class GetZones extends Usecase<Zone[], GetZonesParams> {
    private zoneRepository: ZoneRemoteRepository

    public constructor(zoneRepository: ZoneRemoteRepository) {
        super()
        this.zoneRepository = zoneRepository
    }

    public async perform(params: GetZonesParams): Promise<Result<Zone[]>> {
        try {
            const result = await this.zoneRepository.findAll(params.text)
            if (result.length == 0) {
                return succeed(204, `[${this.constructor.name}] Trying to fetch zones : none found (odd behavior).`, result, SuccessType.WARNING)
            }
            return succeed(200, `[${this.constructor.name}] Trying to fetch zones : success`, result)
        } catch (trace) {
            return failed(500, `[${this.constructor.name}] Trying to fetch zones : An exception has been thrown.`, { message: "An internal error occured while fetching zones" }, trace)
        }
    }
}
